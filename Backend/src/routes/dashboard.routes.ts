import express from "express";
import { authenticate, authorize, AuthRequest } from "../middlewares/auth.middleware";

const router = express.Router();

// ✅ User Dashboard Route
router.get("/user", authenticate, authorize("user"), (req: AuthRequest, res) => {
  res.json({ message: "Welcome to User Dashboard", user: req.user });
});

// ✅ Verifier Dashboard Route
router.get("/verifier", authenticate, authorize("verifier"), (req: AuthRequest, res) => {
  res.json({ message: "Welcome to Verifier Dashboard", user: req.user });
});

// ✅ Admin Dashboard Route
router.get("/admin", authenticate, authorize("admin"), (req: AuthRequest, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

export default router;
