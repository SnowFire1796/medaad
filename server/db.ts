import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import { InsertUser, UserProfile, users, userProfiles, conversations, messages, learningFiles, quizzes, quizQuestions, quizAttempts, flashcards, studyPlans, classes, classMembers, lessons, assignments, progressEvents } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; } else { values.lastSignedIn = new Date(); updateSet.lastSignedIn = new Date(); }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return rows[0]; }

export async function getProfile(userId: number) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1); return rows[0]; }
export async function upsertProfile(userId: number, data: Partial<Pick<UserProfile, "role" | "name" | "grade" | "subjects" | "bio">>) {
  const db = await getDb(); if (!db) throw new Error("Database is not configured");
  const existing = await getProfile(userId);
  const values = { userId, role: existing?.role ?? data.role ?? "student", name: data.name ?? existing?.name ?? null, grade: data.grade ?? existing?.grade ?? null, subjects: data.subjects ?? existing?.subjects ?? null, bio: data.bio ?? existing?.bio ?? null };
  if (existing) { await db.update(userProfiles).set({ ...values, updatedAt: new Date() }).where(eq(userProfiles.userId, userId)); }
  else { await db.insert(userProfiles).values(values); }
  return getProfile(userId);
}

export async function getDashboardSummary(userId: number) {
  const db = await getDb(); if (!db) return { conversations: 0, quizzes: 0, flashcards: 0, plans: 0, completedLessons: 0, studyMinutes: 0, recentActivity: [], recentQuizzes: [], upcomingPlans: [] };
  const [conversationCount, quizCount, flashcardCount, planCount, activity, recentQuizzes, upcomingPlans] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(conversations).where(eq(conversations.userId, userId)),
    db.select({ count: sql<number>`count(*)` }).from(quizAttempts).where(eq(quizAttempts.userId, userId)),
    db.select({ count: sql<number>`count(*)` }).from(flashcards).where(eq(flashcards.userId, userId)),
    db.select({ count: sql<number>`count(*)` }).from(studyPlans).where(and(eq(studyPlans.userId, userId), eq(studyPlans.status, "active"))),
    db.select().from(progressEvents).where(eq(progressEvents.userId, userId)).orderBy(desc(progressEvents.createdAt)).limit(6),
    db.select({ attempt: quizAttempts, quiz: quizzes }).from(quizAttempts).leftJoin(quizzes, eq(quizAttempts.quizId, quizzes.id)).where(eq(quizAttempts.userId, userId)).orderBy(desc(quizAttempts.submittedAt)).limit(4),
    db.select().from(studyPlans).where(and(eq(studyPlans.userId, userId), eq(studyPlans.status, "active"))).orderBy(desc(studyPlans.createdAt)).limit(4),
  ]);
  return { conversations: Number(conversationCount[0]?.count ?? 0), quizzes: Number(quizCount[0]?.count ?? 0), flashcards: Number(flashcardCount[0]?.count ?? 0), plans: Number(planCount[0]?.count ?? 0), completedLessons: activity.filter(item => item.type === "lesson_completed").length, studyMinutes: activity.reduce((sum, item) => sum + (item.minutes ?? 0), 0), recentActivity: activity, recentQuizzes, upcomingPlans };
}

export async function createConversation(userId: number, title: string, subject?: string) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); const result = await db.insert(conversations).values({ userId, title, subject: subject ?? null }); return Number(result[0].insertId); }
export async function listConversations(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.updatedAt)).limit(20); }
export async function getConversationMessages(userId: number, conversationId: number) { const db = await getDb(); if (!db) return []; const allowed = await db.select().from(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId))).limit(1); if (!allowed[0]) return []; return db.select().from(messages).where(and(eq(messages.conversationId, conversationId), eq(messages.userId, userId))).orderBy(messages.createdAt); }
export async function addMessage(userId: number, conversationId: number, role: "user" | "assistant", content: string) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); const allowed = await db.select({ id: conversations.id }).from(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId))).limit(1); if (!allowed[0]) throw new Error("Conversation not found"); await db.insert(messages).values({ userId, conversationId, role, content }); await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, conversationId)); }

export async function listFiles(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(learningFiles).where(eq(learningFiles.userId, userId)).orderBy(desc(learningFiles.createdAt)); }
export async function saveFile(userId: number, data: { name: string; storageKey: string; url: string; mimeType: string; size: number }) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); await db.insert(learningFiles).values({ userId, ...data }); return listFiles(userId); }

export async function listQuizzes(userId: number, teacher = false) { const db = await getDb(); if (!db) return []; return db.select().from(quizzes).where(teacher ? eq(quizzes.creatorId, userId) : eq(quizzes.status, "published")).orderBy(desc(quizzes.createdAt)); }
export async function getQuiz(id: number) { const db = await getDb(); if (!db) return undefined; const quizRows = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1); if (!quizRows[0]) return undefined; const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, id)).orderBy(quizQuestions.position); return { ...quizRows[0], questions }; }
export async function createQuiz(userId: number, input: { title: string; subject: string; topic?: string; description?: string; timeLimit?: number; status?: "draft" | "published"; questions: Array<{ question: string; type: "multiple_choice" | "true_false" | "descriptive"; options?: string[]; correctAnswer?: string; explanation?: string }> }) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); const result = await db.insert(quizzes).values({ creatorId: userId, title: input.title, subject: input.subject, topic: input.topic ?? null, description: input.description ?? null, timeLimit: input.timeLimit ?? null, status: input.status ?? "draft" }); const quizId = Number(result[0].insertId); if (input.questions.length) await db.insert(quizQuestions).values(input.questions.map((q, i) => ({ quizId, question: q.question, type: q.type, options: q.options ?? [], correctAnswer: q.correctAnswer ?? null, explanation: q.explanation ?? null, position: i }))); return getQuiz(quizId); }
export async function saveQuizAttempt(userId: number, quizId: number, answers: Record<string, string>) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); const quiz = await getQuiz(quizId); if (!quiz) throw new Error("Quiz not found"); let score = 0; for (const q of quiz.questions) if (q.correctAnswer && answers[String(q.id)] && q.correctAnswer === answers[String(q.id)]) score += 1; await db.insert(quizAttempts).values({ userId, quizId, score, total: quiz.questions.length, answers }); await db.insert(progressEvents).values({ userId, type: "quiz_completed", subject: quiz.subject, topic: quiz.topic ?? null, minutes: null }); return { score, total: quiz.questions.length, quizTitle: quiz.title }; }

export async function listFlashcards(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(flashcards).where(eq(flashcards.userId, userId)).orderBy(desc(flashcards.createdAt)); }
export async function createFlashcard(userId: number, input: { question: string; answer: string; subject?: string; topic?: string }) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); await db.insert(flashcards).values({ userId, question: input.question, answer: input.answer, subject: input.subject ?? null, topic: input.topic ?? null }); return listFlashcards(userId); }
export async function toggleFlashcard(userId: number, id: number, difficult: boolean) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); await db.update(flashcards).set({ difficult }).where(and(eq(flashcards.id, id), eq(flashcards.userId, userId))); return listFlashcards(userId); }

export async function listStudyPlans(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(studyPlans).where(eq(studyPlans.userId, userId)).orderBy(desc(studyPlans.createdAt)); }
export async function createStudyPlan(userId: number, input: { title: string; goal?: string; subject?: string; deadline?: Date; dailyMinutes?: number }) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); await db.insert(studyPlans).values({ userId, title: input.title, goal: input.goal ?? null, subject: input.subject ?? null, deadline: input.deadline ?? null, dailyMinutes: input.dailyMinutes ?? null }); return listStudyPlans(userId); }

export async function listTeacherClasses(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(classes).where(eq(classes.teacherId, userId)).orderBy(desc(classes.createdAt)); }
export async function createClass(userId: number, input: { name: string; description?: string; subject?: string; inviteCode: string }) { const db = await getDb(); if (!db) throw new Error("Database is not configured"); const result = await db.insert(classes).values({ teacherId: userId, name: input.name, description: input.description ?? null, subject: input.subject ?? null, inviteCode: input.inviteCode }); await db.insert(classMembers).values({ classId: Number(result[0].insertId), userId, role: "teacher" }); return listTeacherClasses(userId); }
export async function listClassLessons(userId: number) { const db = await getDb(); if (!db) return []; return db.select({ lesson: lessons, className: classes.name }).from(lessons).innerJoin(classes, eq(lessons.classId, classes.id)).where(eq(lessons.creatorId, userId)).orderBy(desc(lessons.createdAt)); }
export async function listTeacherAssignments(userId: number) { const db = await getDb(); if (!db) return []; return db.select({ assignment: assignments, className: classes.name }).from(assignments).innerJoin(classes, eq(assignments.classId, classes.id)).where(eq(assignments.creatorId, userId)).orderBy(desc(assignments.createdAt)); }
export async function getTeacherCounts(userId: number) { const db = await getDb(); if (!db) return { classes: 0, lessons: 0, assignments: 0, students: 0 }; const [c, l, a, s] = await Promise.all([db.select({ count: sql<number>`count(*)` }).from(classes).where(eq(classes.teacherId, userId)), db.select({ count: sql<number>`count(*)` }).from(lessons).where(eq(lessons.creatorId, userId)), db.select({ count: sql<number>`count(*)` }).from(assignments).where(eq(assignments.creatorId, userId)), db.select({ count: sql<number>`count(*)` }).from(classMembers).innerJoin(classes, eq(classMembers.classId, classes.id)).where(and(eq(classes.teacherId, userId), eq(classMembers.role, "student")))]); return { classes: Number(c[0]?.count ?? 0), lessons: Number(l[0]?.count ?? 0), assignments: Number(a[0]?.count ?? 0), students: Number(s[0]?.count ?? 0) }; }
