import { boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  role: mysqlEnum("role", ["student", "teacher"]).default("student").notNull(),
  name: varchar("name", { length: 160 }),
  grade: varchar("grade", { length: 80 }),
  subjects: text("subjects"),
  bio: text("bio"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  subject: varchar("subject", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const learningFiles = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 240 }).notNull(),
  storageKey: varchar("storageKey", { length: 500 }).notNull(),
  url: varchar("url", { length: 700 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  size: int("size").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  subject: varchar("subject", { length: 120 }).notNull(),
  topic: varchar("topic", { length: 160 }),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  timeLimit: int("timeLimit"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quizQuestions = mysqlTable("quizQuestions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(),
  question: text("question").notNull(),
  type: mysqlEnum("type", ["multiple_choice", "true_false", "descriptive"]).notNull(),
  options: json("options").$type<string[]>(),
  correctAnswer: text("correctAnswer"),
  explanation: text("explanation"),
  position: int("position").default(0).notNull(),
});

export const quizAttempts = mysqlTable("quizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(),
  userId: int("userId").notNull(),
  score: int("score"),
  total: int("total").notNull(),
  answers: json("answers").$type<Record<string, string>>(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export const flashcards = mysqlTable("flashcards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  subject: varchar("subject", { length: 120 }),
  topic: varchar("topic", { length: 160 }),
  difficult: boolean("difficult").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const studyPlans = mysqlTable("studyPlans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  goal: text("goal"),
  subject: varchar("subject", { length: 120 }),
  deadline: timestamp("deadline"),
  dailyMinutes: int("dailyMinutes"),
  status: mysqlEnum("status", ["active", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  teacherId: int("teacherId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 120 }),
  inviteCode: varchar("inviteCode", { length: 24 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const classMembers = mysqlTable("classMembers", {
  id: int("id").autoincrement().primaryKey(),
  classId: int("classId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["teacher", "student"]).notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  classId: int("classId").notNull(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 120 }),
  topic: varchar("topic", { length: 160 }),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const assignments = mysqlTable("assignments", {
  id: int("id").autoincrement().primaryKey(),
  classId: int("classId").notNull(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description"),
  dueAt: timestamp("dueAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const assignmentSubmissions = mysqlTable("assignmentSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  assignmentId: int("assignmentId").notNull(),
  userId: int("userId").notNull(),
  content: text("content"),
  status: mysqlEnum("status", ["submitted", "graded"]).default("submitted").notNull(),
  grade: int("grade"),
  feedback: text("feedback"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const progressEvents = mysqlTable("progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 80 }).notNull(),
  subject: varchar("subject", { length: 120 }),
  topic: varchar("topic", { length: 160 }),
  minutes: int("minutes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
