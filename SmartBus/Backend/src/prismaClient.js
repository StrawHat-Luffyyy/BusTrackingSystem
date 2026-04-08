import "dotenv/config";
import prismaPkg from "./generated/prisma/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = prismaPkg;

if (!process.env.DATABASE_URL) {
	throw new Error(
		"DATABASE_URL is not set. Add it to your environment or .env file before starting the backend.",
	);
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
	adapter,
});