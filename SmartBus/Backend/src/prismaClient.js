import prismaPkg from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = prismaPkg;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });