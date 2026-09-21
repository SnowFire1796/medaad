import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(user?: TrpcContext["user"]): TrpcContext {
  return {
    user: user ?? null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

const student = {
  id: 42,
  openId: "medaad-test-user",
  email: "student@medaad.test",
  name: "دانش‌آموز آزمایشی",
  loginMethod: "test",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("Medaad core procedures", () => {
  it("returns the current user through auth.me", async () => {
    const caller = appRouter.createCaller(context(student));
    await expect(caller.auth.me()).resolves.toMatchObject({ id: 42, name: "دانش‌آموز آزمایشی" });
  });

  it("rejects protected tutor history for anonymous users", async () => {
    const caller = appRouter.createCaller(context());
    await expect(caller.tutor.conversations()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("does not allow a default user into teacher procedures", async () => {
    const caller = appRouter.createCaller(context(student));
    await expect(caller.teacher.counts()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
