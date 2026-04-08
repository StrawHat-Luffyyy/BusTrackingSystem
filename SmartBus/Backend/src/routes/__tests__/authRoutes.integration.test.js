import { jest } from "@jest/globals";
import request from "supertest";

beforeEach(() => {
  process.env.JWT_SECRET = "test-secret";
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.JWT_COOKIE_EXPIRES_IN = "1";
  process.env.NODE_ENV = "test";
});

const prismaMock = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

await jest.unstable_mockModule("../../prismaClient.js", () => ({
  prisma: prismaMock,
}));

// bcrypt is used by authController; mock for determinism.
await jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(async () => "hashed"),
    compare: jest.fn(async () => true),
  },
}));

const { default: app } = await import("../../app.js");

describe("Auth flows (integration-ish)", () => {
  test("signup forces COMMUTER role (cannot self-assign ADMIN)", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      role: "ADMIN",
    });

    expect(res.status).toBe(403);
  });

  test("login returns token and sets cookie", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 1,
      name: "Bob",
      email: "bob@example.com",
      passwordHash: "hashed",
      role: "COMMUTER",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "bob@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body?.token).toBeTruthy();
    const setCookie = res.headers["set-cookie"] || [];
    expect(setCookie.join(";")).toMatch(/jwt=/);
  });
});

