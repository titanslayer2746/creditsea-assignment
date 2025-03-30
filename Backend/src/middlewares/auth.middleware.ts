import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// ✅ Extend Request Type
export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ✅ Authentication Middleware
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded; // ✅ Attach user to request

    next(); // ✅ Proceed to next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Authorization Middleware (Role-Based Access)
export const authorize = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ message: "Forbidden: You do not have access" });
      return;
    }
    next(); // ✅ Proceed to next middleware
  };
};
