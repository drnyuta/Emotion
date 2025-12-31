import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await AuthService.register(email, password);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await AuthService.login(email, password);

      res.json({
        success: true,
        token: result.token,
        user: result.user,
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result = await AuthService.forgotPassword(email);

      res.json({
        success: true,
        message: result.message,
        // Remove resetToken in production
        ...(result.resetToken && { resetToken: result.resetToken }),
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: "Token and password are required",
        });
      }

      const result = await AuthService.resetPassword(token, password);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token provided",
        });
      }

      const decoded = AuthService.verifyToken(token);

      res.json({
        success: true,
        user: decoded,
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  }
}