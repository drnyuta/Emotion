import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { client } from "../database";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../utils/email";
import {
  FRONTEND_URL,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  RESET_TOKEN_EXPIRES_IN,
} from "../constants/auth";
import { User } from "../types";

export const register = async (email: string, password: string) => {
  const existingUser = await client.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await client.query(
    `INSERT INTO users (name, email, password_hash, timezone) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, email, timezone, created_at`,
    ["User", email, passwordHash, "UTC"]
  );

  const newUser = result.rows[0];

  try {
    await sendWelcomeEmail(newUser.email);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }

  return newUser;
};

export const login = async (email: string, password: string) => {
  const result = await client.query(
    "SELECT id, name, email, password_hash, timezone FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user: User = result.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
    },
  };
};

export const forgotPassword = async (
  email: string
): Promise<{ message: string; resetToken?: string }> => {
  const result = await client.query(
    "SELECT id, name FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return {
      message: "If the email exists, a reset link has been sent",
    };
  }

  const user = result.rows[0];

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN);

  await client.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [
    user.id,
  ]);

  await client.query(
    "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [user.id, hashedToken, expiresAt]
  );

  const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await sendPasswordResetEmail(email, resetUrl);
  } catch (error) {
    console.error("Failed to send reset email:", error);
    throw new Error("Failed to send reset email. Please try again later.");
  }

  return {
    message: "If the email exists, a reset link has been sent",
    ...(process.env.NODE_ENV === "development" && { resetToken }),
  };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const result = await client.query(
    `SELECT user_id FROM password_reset_tokens 
     WHERE token = $1 AND expires_at > NOW()`,
    [hashedToken]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid or expired reset token");
  }

  const userId = result.rows[0].user_id;

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await client.query(
    "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
    [passwordHash, userId]
  );

  await client.query("DELETE FROM password_reset_tokens WHERE token = $1", [
    hashedToken,
  ]);

  return { message: "Password successfully reset" };
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      name: string;
    };
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const getUserById = async (userId: number) => {
  const result = await client.query(
    "SELECT id, name, email, timezone, created_at FROM users WHERE id = $1",
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};
