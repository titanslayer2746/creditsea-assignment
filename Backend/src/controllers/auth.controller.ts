import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { validationResult } from "express-validator";

const COOKIE_EXPIRY = 3 * 24 * 60 * 60 * 1000; // 3 days

// Signup
export const signUp = async (req: Request, res: Response): Promise<void> => {
  // Validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { fullName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser){
        res.status(400).json({ message: "Email already exists" });
        return;
    } 

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user){
        res.status(400).json({ message: "Invalid credentials" });
        return;
    } 
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "3d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // Use false in development
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Allows cross-site cookies in dev
      maxAge: COOKIE_EXPIRY,
    });
    

    res.json({ message: "Login successful", user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout
export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
