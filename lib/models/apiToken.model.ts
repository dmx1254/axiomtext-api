import mongoose, { Document, Schema } from "mongoose";

export interface IAPIToken extends Document {
  userId: string;
  name: string;
  token: string;
  hashedToken: string;
  lastUsed?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const apiTokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    hashedToken: {
      type: String,
      required: true,
      unique: true,
    },
    lastUsed: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// // Hash token before saving
// apiTokenSchema.pre("save", function(next) {
//   if (this.isModified("token")) {
//     this.hashedToken = crypto.createHash("sha256").update(this.token).digest("hex");
//   }
//   next();
// });

const APITokenModel =
  mongoose.models.APIToken ||
  mongoose.model<IAPIToken>("APIToken", apiTokenSchema);

export default APITokenModel;
