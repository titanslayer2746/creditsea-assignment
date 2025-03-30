import mongoose, { Schema, Document } from "mongoose";

export interface ILoanRequest extends Document {
  username: string;
  loanAmount: number;
  status: "pending" | "verified" | "rejected" | "approved";
  dateApplied: Date;
}

const LoanRequestSchema = new Schema<ILoanRequest>({
  username: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected", "approved"],
    default: "pending",
  },
  dateApplied: { type: Date, default: Date.now },
});

export default mongoose.model<ILoanRequest>("LoanRequest", LoanRequestSchema);
