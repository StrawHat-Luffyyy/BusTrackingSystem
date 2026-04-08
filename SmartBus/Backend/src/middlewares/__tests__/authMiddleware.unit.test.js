import { jest } from "@jest/globals";

beforeEach(() => {
  process.env.JWT_SECRET = "test-secret";
});

// Mock prismaClient BEFORE importing the middleware under test.
const prismaMock = {
  user: {
    findUnique: jest.fn(),
  },
};

await jest.unstable_mockModule("../../prismaClient.js", () => ({
  prisma: prismaMock,
}));

const { protect, restrictTo } = await import("../authMiddleware.js");
const { signTestToken } = await import("../../utils/jwt.test-utils.js");

function makeRes() {
  return {};
}

function makeNext() {
  return jest.fn();
}

describe("authMiddleware.protect (unit)", () => {
  test("rejects when no cookie token", async () => {
    const req = { cookies: {} };
    const res = makeRes();
    const next = makeNext();

    await protect(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("rejects when user no longer exists", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    const token = signTestToken({ id: 123, role: "COMMUTER" });

    const req = { cookies: { jwt: token } };
    const res = makeRes();
    const next = makeNext();

    await protect(req, res, next);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 123 } });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("rejects when token role doesn't match DB role", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 1, role: "COMMUTER" });
    const token = signTestToken({ id: 1, role: "ADMIN" });

    const req = { cookies: { jwt: token } };
    const res = makeRes();
    const next = makeNext();

    await protect(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("attaches req.user when valid", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 7, role: "ADMIN" });
    const token = signTestToken({ id: 7, role: "ADMIN" });

    const req = { cookies: { jwt: token } };
    const res = makeRes();
    const next = makeNext();

    await protect(req, res, next);

    expect(req.user).toEqual({ id: 7, role: "ADMIN" });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeUndefined();
  });
});

describe("authMiddleware.restrictTo (unit)", () => {
  test("rejects when role not allowed", () => {
    const req = { user: { role: "COMMUTER" } };
    const res = makeRes();
    const next = makeNext();

    restrictTo("ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test("allows when role allowed", () => {
    const req = { user: { role: "ADMIN" } };
    const res = makeRes();
    const next = makeNext();

    restrictTo("ADMIN", "OPERATOR")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeUndefined();
  });
});

