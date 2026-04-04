import bcrypt from "bcrypt";
import { prisma } from "../server.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { sendTokenResponse } from "../utils/jwt.js";

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email, and password!", 400));
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role || "COMMUTER",
    },
  });

  sendTokenResponse(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  sendTokenResponse(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};
