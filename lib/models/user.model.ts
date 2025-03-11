import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  accountType: string;
  role: string;
  smsCredits: number;
  isActive: boolean;
  companyName: string;
  pendingCompanyName?: string;
  companyNameStatus: "approved" | "pending" | "rejected";
  companyNameRejectionReason?: string;
  lastCompanyNameChange?: Date;
}

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    accountType: {
      type: String,
      enum: ["personal", "business"],
      default: "personal",
    },
    companyName: {
      type: String,
      required: true,
    },
    pendingCompanyName: {
      type: String,
    },
    companyNameStatus: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "approved",
    },
    companyNameRejectionReason: {
      type: String,
    },
    lastCompanyNameChange: {
      type: Date,
    },
    smsCredits: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
