import { jest } from "@jest/globals";
import request from "supertest";

beforeEach(() => {
  process.env.JWT_SECRET = "test-secret";
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.JWT_COOKIE_EXPIRES_IN = "1";
  process.env.NODE_ENV = "test";
});

const prismaMock = {
  user: { findUnique: jest.fn() },
  route: { create: jest.fn() },
  bus: { create: jest.fn() },
  trip: { create: jest.fn() },
};

await jest.unstable_mockModule("../../prismaClient.js", () => ({
  prisma: prismaMock,
}));

// Avoid S3/multer side effects during tests.
await jest.unstable_mockModule("../../utils/s3Upload.js", () => ({
  upload: { single: () => (req, res, next) => next() },
  uploadToS3: jest.fn(async () => "https://example.com/fake.jpg"),
}));

const { default: app } = await import("../../app.js");
const { signTestToken } = await import("../../utils/jwt.test-utils.js");

describe("Admin routes protection (integration-ish)", () => {
  test("401 when not logged in", async () => {
    const res = await request(app).post("/api/admin/routes").send({
      origin: "A",
      destination: "B",
    });

    expect(res.status).toBe(401);
  });

  test("403 when logged in but not ADMIN/OPERATOR", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1, role: "COMMUTER" });
    const token = signTestToken({ id: 1, role: "COMMUTER" });

    const res = await request(app)
      .post("/api/admin/routes")
      .set("Cookie", [`jwt=${token}`])
      .send({ origin: "A", destination: "B" });

    expect(res.status).toBe(403);
  });

  test("201 when OPERATOR creates route", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 99, role: "OPERATOR" });
    prismaMock.route.create.mockResolvedValueOnce({
      id: 10,
      routeName: "A to B",
      origin: "A",
      destination: "B",
      distanceKm: null,
    });

    const token = signTestToken({ id: 99, role: "OPERATOR" });

    const res = await request(app)
      .post("/api/admin/routes")
      .set("Cookie", [`jwt=${token}`])
      .send({ origin: "A", destination: "B" });

    expect(res.status).toBe(201);
    expect(res.body?.data?.route?.origin).toBe("A");
  });
});

