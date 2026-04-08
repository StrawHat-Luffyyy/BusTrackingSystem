import jwt from "jsonwebtoken";

export function signTestToken({ id, role }, overrides = {}) {
  return jwt.sign(
    { id, role, ...overrides },
    process.env.JWT_SECRET || "test-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
  );
}

