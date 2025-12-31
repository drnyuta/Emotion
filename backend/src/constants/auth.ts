import { Secret } from "jsonwebtoken";

export const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-secret-key";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const RESET_TOKEN_EXPIRES_IN = 3600000; 
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";