import { relations } from "drizzle-orm";
import { users, userProfiles, conversations, messages, quizzes, quizQuestions, quizAttempts, classes, classMembers, lessons, assignments, assignmentSubmissions } from "./schema";

export const userRelations = relations(users, ({ one }) => ({ profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }) }));
export const profileRelations = relations(userProfiles, ({ one }) => ({ user: one(users, { fields: [userProfiles.userId], references: [users.id] }) }));
export const conversationRelations = relations(conversations, ({ many }) => ({ messages: many(messages) }));
export const messageRelations = relations(messages, ({ one }) => ({ conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }) }));
export const quizRelations = relations(quizzes, ({ many }) => ({ questions: many(quizQuestions), attempts: many(quizAttempts) }));
export const quizQuestionRelations = relations(quizQuestions, ({ one }) => ({ quiz: one(quizzes, { fields: [quizQuestions.quizId], references: [quizzes.id] }) }));
export const classRelations = relations(classes, ({ many }) => ({ members: many(classMembers), lessons: many(lessons), assignments: many(assignments) }));
export const classMemberRelations = relations(classMembers, ({ one }) => ({ class: one(classes, { fields: [classMembers.classId], references: [classes.id] }) }));
export const lessonRelations = relations(lessons, ({ one }) => ({ class: one(classes, { fields: [lessons.classId], references: [classes.id] }) }));
export const assignmentRelations = relations(assignments, ({ many }) => ({ submissions: many(assignmentSubmissions) }));
