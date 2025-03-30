import express from "express";
import { signUp, login, logout } from "../controllers/auth.controller";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/signup",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  signUp
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post("/logout", logout);

export default router;
