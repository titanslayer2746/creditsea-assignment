import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "verifier" | "admin";
  loanRequests: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "verifier", "admin"], required: true },
  loanRequests: [{ type: Schema.Types.ObjectId, ref: "LoanRequest" }],
});

export default mongoose.model<IUser>("User", UserSchema);
