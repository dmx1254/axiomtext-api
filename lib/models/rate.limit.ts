import mongoose, { Document, Schema } from "mongoose";


interface RateLimit extends Document {
    key: string;
    count: number;
    resetAt: Date;
    createdAt: Date;
}


const RateLimitSchema = new Schema({
    key: { type: String, required: true, index: true }, // userId ou IP
    count: { type: Number, default: 0 },
    resetAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  

const RateLimitModel = mongoose.models.RateLimit || mongoose.model<RateLimit>("RateLimit", RateLimitSchema);

export default RateLimitModel;

