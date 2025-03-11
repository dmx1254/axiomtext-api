import mongoose from "mongoose";


interface ISms {
  userId: string;
  campaignId: string;
  recipient: string;
  message: string;
  messageId: string;
  status: string;
  sentAt: Date;
  deliveredAt: Date;
  cost: number;
  response: string;
  campaignName: string;
}

const smsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  campaignId: {
    type: String,
    required: true,
  },
  campaignName: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "failed"],
    default: "sent",
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
  },
  cost: {
    type: Number,
  },
  response: {
    type: String,
  }
});

const SMSModel = mongoose.models.SMS || mongoose.model<ISms>("SMS", smsSchema);

export default SMSModel; 