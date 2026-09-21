import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { getProfile, upsertProfile, getDashboardSummary, createConversation, listConversations, getConversationMessages, addMessage, listFiles, saveFile, listQuizzes, getQuiz, createQuiz, saveQuizAttempt, listFlashcards, createFlashcard, toggleFlashcard, listStudyPlans, createStudyPlan, listTeacherClasses, createClass, listClassLessons, listTeacherAssignments, getTeacherCounts } from "./db";

const teacherProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const profile = await getProfile(ctx.user.id);
  if (profile?.role !== "teacher" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "این بخش فقط برای معلم‌هاست." });
  return next({ ctx });
});

function messageText(response: any) {
  const content = response?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((part: any) => part?.text ?? "").join(" ").trim();
  return "پاسخی از سرویس هوش مصنوعی دریافت نشد.";
}

const baseTutorPrompt = `تو «مداد» هستی؛ یک معلم فارسی‌زبان صبور و دقیق. هدف تو کمک به یادگیری واقعی است، نه انجام تکلیف به جای دانش‌آموز. پاسخ‌ها را به فارسی و راست‌به‌چپ، روشن و مرحله‌به‌مرحله بنویس. اگر سؤال مبهم است، قبل از پاسخ سؤال روشن‌کننده بپرس. در مسائل ریاضی راه‌حل را توضیح بده و در پایان یک سؤال تمرینی کوتاه پیشنهاد کن. از تشویق به تقلب یا ارائه پاسخ بدون توضیح خودداری کن.`;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  profile: router({
    me: protectedProcedure.query(({ ctx }) => getProfile(ctx.user.id)),
    save: protectedProcedure.input(z.object({ role: z.enum(["student", "teacher"]).optional(), name: z.string().max(160).optional(), grade: z.string().max(80).optional(), subjects: z.string().max(500).optional(), bio: z.string().max(1000).optional() })).mutation(({ ctx, input }) => upsertProfile(ctx.user.id, input)),
  }),
  dashboard: router({
    summary: protectedProcedure.query(({ ctx }) => getDashboardSummary(ctx.user.id)),
  }),
  tutor: router({
    conversations: protectedProcedure.query(({ ctx }) => listConversations(ctx.user.id)),
    messages: protectedProcedure.input(z.object({ conversationId: z.number().int().positive() })).query(({ ctx, input }) => getConversationMessages(ctx.user.id, input.conversationId)),
    send: protectedProcedure.input(z.object({ conversationId: z.number().int().positive().optional(), message: z.string().min(1).max(6000), subject: z.string().max(120).optional(), topic: z.string().max(160).optional(), grade: z.string().max(80).optional(), quickAction: z.string().max(120).optional() })).mutation(async ({ ctx, input }) => {
      try {
        const conversationId = input.conversationId ?? await createConversation(ctx.user.id, input.topic ? `گفت‌وگو درباره ${input.topic}` : "گفت‌وگوی جدید", input.subject);
        await addMessage(ctx.user.id, conversationId, "user", input.message);
        const history = await getConversationMessages(ctx.user.id, conversationId);
        const response = await invokeLLM({ messages: [{ role: "system", content: `${baseTutorPrompt}\nپایه دانش‌آموز: ${input.grade ?? "نامشخص"}\nدرس: ${input.subject ?? "نامشخص"}\nموضوع: ${input.topic ?? "نامشخص"}` }, ...history.slice(-10).map(item => ({ role: item.role as "user" | "assistant", content: item.content }))] });
        const answer = messageText(response);
        await addMessage(ctx.user.id, conversationId, "assistant", answer);
        return { conversationId, answer };
      } catch (error) { console.error("[Tutor]", error); throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "اتصال به سرویس هوش مصنوعی برقرار نشد. دوباره تلاش کن." }); }
    }),
  }),
  solve: router({
    image: protectedProcedure.input(z.object({ data: z.string().min(20), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]) })).mutation(async ({ input }) => {
      try {
        const response = await invokeLLM({ messages: [{ role: "system", content: `${baseTutorPrompt}\nاین تصویر یک سؤال درسی است. ابتدا بگو سؤال چه چیزی می‌خواهد، سپس راه‌حل مرحله‌به‌مرحله و پاسخ نهایی را بنویس.` }, { role: "user", content: [{ type: "image_url", image_url: { url: `data:${input.mimeType};base64,${input.data}`, detail: "high" } }, { type: "text", text: "این سؤال را به فارسی و مرحله‌به‌مرحله حل کن." }] }] });
        return { answer: messageText(response) };
      } catch (error) { console.error("[Solve]", error); throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "تحلیل تصویر انجام نشد. مطمئن شو تصویر واضح است و دوباره تلاش کن." }); }
    }),
  }),
  files: router({
    list: protectedProcedure.query(({ ctx }) => listFiles(ctx.user.id)),
    upload: protectedProcedure.input(z.object({ name: z.string().min(1).max(240), mimeType: z.enum(["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"]), size: z.number().int().positive().max(10_000_000), data: z.string().min(20) })).mutation(async ({ ctx, input }) => { try { const buffer = Buffer.from(input.data, "base64"); if (buffer.length > 10_000_000) throw new TRPCError({ code: "BAD_REQUEST", message: "حجم فایل بیش از حد مجاز است." }); const stored = await storagePut(`${ctx.user.id}-files/${input.name}`, buffer, input.mimeType); return saveFile(ctx.user.id, { name: input.name, mimeType: input.mimeType, size: buffer.length, storageKey: stored.key, url: stored.url }); } catch (error) { if (error instanceof TRPCError) throw error; console.error("[Files]", error); throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "بارگذاری فایل انجام نشد. دوباره تلاش کن." }); } }),
    summarize: protectedProcedure.input(z.object({ text: z.string().min(20).max(30000), action: z.enum(["summary", "questions", "explain", "flashcards", "quiz"]) })).mutation(async ({ input }) => { try { const actionText = { summary: "یک خلاصه منظم با نکات کلیدی بنویس", questions: "۵ سؤال مرور مفهومی بساز", explain: "این مطلب را مثل یک معلم برای دانش‌آموز پایه متوسطه توضیح بده", flashcards: "فلش‌کارت‌های پرسش و پاسخ بساز", quiz: "یک آزمون کوتاه با پاسخ تشریحی طراحی کن" }[input.action]; const response = await invokeLLM({ messages: [{ role: "system", content: `${baseTutorPrompt}\n${actionText}.` }, { role: "user", content: input.text }] }); return { answer: messageText(response) }; } catch (error) { console.error("[Document]", error); throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "پردازش مطلب انجام نشد. دوباره تلاش کن." }); } }),
  }),
  quizzes: router({
    list: protectedProcedure.input(z.object({ teacher: z.boolean().optional() }).optional()).query(({ ctx, input }) => listQuizzes(ctx.user.id, Boolean(input?.teacher))),
    get: protectedProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getQuiz(input.id)),
    create: teacherProcedure.input(z.object({ title: z.string().min(2).max(220), subject: z.string().min(2).max(120), topic: z.string().max(160).optional(), description: z.string().max(2000).optional(), timeLimit: z.number().int().positive().max(240).optional(), status: z.enum(["draft", "published"]).default("draft"), questions: z.array(z.object({ question: z.string().min(2), type: z.enum(["multiple_choice", "true_false", "descriptive"]), options: z.array(z.string()).optional(), correctAnswer: z.string().optional(), explanation: z.string().optional() })).min(1) })).mutation(({ ctx, input }) => createQuiz(ctx.user.id, input)),
    attempt: protectedProcedure.input(z.object({ quizId: z.number().int().positive(), answers: z.record(z.string(), z.string()) })).mutation(({ ctx, input }) => saveQuizAttempt(ctx.user.id, input.quizId, input.answers)),
    generate: teacherProcedure.input(z.object({ text: z.string().min(20).max(30000), subject: z.string().min(2).max(120), count: z.number().int().min(3).max(10) })).mutation(async ({ input }) => { try { const response = await invokeLLM({ messages: [{ role: "system", content: "برای یک معلم فارسی‌زبان، سؤال آزمون تولید کن. سؤال‌ها باید دقیق و قابل ویرایش باشند و پاسخ و توضیح داشته باشند." }, { role: "user", content: `درس: ${input.subject}\nتعداد: ${input.count}\nمحتوا:\n${input.text}` }], response_format: { type: "json_schema", json_schema: { name: "quiz_questions", strict: true, schema: { type: "object", properties: { questions: { type: "array", items: { type: "object", properties: { question: { type: "string" }, type: { type: "string", enum: ["multiple_choice", "true_false", "descriptive"] }, options: { type: "array", items: { type: "string" } }, correctAnswer: { type: "string" }, explanation: { type: "string" } }, required: ["question", "type", "options", "correctAnswer", "explanation"], additionalProperties: false } } }, required: ["questions"], additionalProperties: false } } } }); const raw = messageText(response); return JSON.parse(raw) as { questions: Array<{ question: string; type: "multiple_choice" | "true_false" | "descriptive"; options: string[]; correctAnswer: string; explanation: string }> }; } catch (error) { console.error("[Quiz Generate]", error); throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "ساخت آزمون انجام نشد. دوباره تلاش کن." }); } }),
  }),
  flashcards: router({ list: protectedProcedure.query(({ ctx }) => listFlashcards(ctx.user.id)), create: protectedProcedure.input(z.object({ question: z.string().min(2).max(2000), answer: z.string().min(2).max(4000), subject: z.string().max(120).optional(), topic: z.string().max(160).optional() })).mutation(({ ctx, input }) => createFlashcard(ctx.user.id, input)), toggleDifficult: protectedProcedure.input(z.object({ id: z.number().int().positive(), difficult: z.boolean() })).mutation(({ ctx, input }) => toggleFlashcard(ctx.user.id, input.id, input.difficult)), }),
  planner: router({ list: protectedProcedure.query(({ ctx }) => listStudyPlans(ctx.user.id)), create: protectedProcedure.input(z.object({ title: z.string().min(2).max(220), goal: z.string().max(1000).optional(), subject: z.string().max(120).optional(), deadline: z.coerce.date().optional(), dailyMinutes: z.number().int().positive().max(720).optional() })).mutation(({ ctx, input }) => createStudyPlan(ctx.user.id, input)), }),
  teacher: router({ counts: teacherProcedure.query(({ ctx }) => getTeacherCounts(ctx.user.id)), classes: teacherProcedure.query(({ ctx }) => listTeacherClasses(ctx.user.id)), createClass: teacherProcedure.input(z.object({ name: z.string().min(2).max(180), description: z.string().max(1000).optional(), subject: z.string().max(120).optional() })).mutation(({ ctx, input }) => createClass(ctx.user.id, { ...input, inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase() })), lessons: teacherProcedure.query(({ ctx }) => listClassLessons(ctx.user.id)), assignments: teacherProcedure.query(({ ctx }) => listTeacherAssignments(ctx.user.id)), }),
});

export type AppRouter = typeof appRouter;
