import { Request, Response } from "express";
import LoanRequest, { ILoanRequest } from "../models/loanRequest.model";
import User from "../models/user.model";
import { Types } from "mongoose";

// ✅ Create Loan Request
export const createLoanRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loanAmount } = req.body;
    const userId = (req as any).user.id; // Extract user ID from auth middleware

    const user = await User.findById(userId);
    if (!user){
        res.status(404).json({ message: "User not found" });
        return;
    } 

    const loanRequest = new LoanRequest({
      username: user.fullName,
      loanAmount,
    });

    await loanRequest.save();

    user.loanRequests.push(loanRequest._id as Types.ObjectId);
    await user.save();

    res.status(201).json({ message: "Loan request submitted successfully", loanRequest });
  } catch (error) {
    res.status(500).json({ message: "Error creating loan request", error });
  }
};

// ✅ Get Loan Requests for Logged-in User
export const getUserLoanRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).populate("loanRequests");
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.json(user.loanRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching loan requests", error });
  }
};

// ✅ Update Loan Request Status (Verifiers/Admins Only)
export const updateLoanStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const userRole = (req as any).user.role;

    // ✅ Ensure status is valid
    if (!["pending", "verified", "rejected", "approved"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    // ✅ Fetch loan request
    const loanRequest = await LoanRequest.findById(req.params.id);
    if (!loanRequest) {
      res.status(404).json({ message: "Loan request not found" });
      return;
    }

    // ✅ Role-based restrictions
    if (userRole === "verifier") {
      if (status !== "verified" && status !== "rejected") {
        res.status(403).json({ message: "Verifiers can only verify or reject requests" });
        return;
      }
    } else if (userRole === "admin") {
      if (status === "approved" && loanRequest.status !== "verified") {
        res.status(403).json({ message: "Admins can only approve verified requests" });
        return;
      }
      if (status !== "approved" && status !== "rejected") {
        res.status(403).json({ message: "Admins can only approve or reject requests" });
        return;
      }
    } else {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    // ✅ Update status
    loanRequest.status = status;
    await loanRequest.save();

    res.json({ message: "Loan request updated", loanRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating loan request", error });
  }
};
