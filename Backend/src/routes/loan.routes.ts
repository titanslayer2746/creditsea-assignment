import express from "express";
import { createLoanRequest, getUserLoanRequests, updateLoanStatus } from "../controllers/loan.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// ✅ Create Loan Request
router.post("/", authenticate, createLoanRequest);

// ✅ Get All Loan Requests for Logged-in User
router.get("/", authenticate, getUserLoanRequests); 

// ✅ Update Loan Request Status (Only for verifiers/admins)
router.put("/:id", authenticate, updateLoanStatus);

export default router;
