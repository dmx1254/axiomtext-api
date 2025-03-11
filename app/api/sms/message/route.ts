import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import crypto from "crypto";
import { verifyApiToken } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import SMSModel from "@/lib/models/sms.model";

await connectDB();
const SMS_PRO_PRIVATE_KEY = process.env.SMS_PRO_PRIVATE_KEY || "";
const SMS_PRO_TOKEN = process.env.SMS_PRO_TOKEN || "";
const API_URL = "https://api.orangesmspro.sn:8443/api";

function generateKey(
  token: string,
  subject: string,
  signature: string,
  recipient: string,
  content: string,
  timestamp: number
): string {
  const msgToEncrypt = `${token}${subject}${signature}${recipient}${content}${timestamp}`;
  return crypto
    .createHmac("sha1", SMS_PRO_PRIVATE_KEY)
    .update(msgToEncrypt)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    // Verify API token
    const authResult = await verifyApiToken(request);
    if (authResult instanceof NextResponse) return authResult;

    // Get user and check credits
    const user = await UserModel.findById(authResult.userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { to, message, signature = user.companyName || "SMS" } = body;

    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { error: "Numéro de téléphone et message requis" },
        { status: 400 }
      );
    }

    // Check credits
    if (!user.smsCredits || user.smsCredits <= 0) {
      return NextResponse.json(
        { error: "Crédits SMS insuffisants" },
        { status: 403 }
      );
    }

    // Format phone number
    const formattedPhone = to.startsWith("+") ? to : `+${to}`;

    // Prepare API call parameters
    const timestamp = Math.floor(Date.now() / 1000);
    const subject = "API_SMS";
    const key = generateKey(
      SMS_PRO_TOKEN,
      subject,
      signature,
      formattedPhone,
      message,
      timestamp
    );

    // Send SMS via Orange SMS Pro
    const response = await axios.post(
      API_URL,
      {
        token: SMS_PRO_TOKEN,
        subject,
        signature,
        recipient: formattedPhone,
        content: message,
        timestamp,
        key,
      },
      {
        auth: {
          username: process.env.SMS_PRO_LOGIN || "",
          password: SMS_PRO_TOKEN,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Save SMS record
    const sms = await SMSModel.create({
      userId: authResult.userId,
      campaignId: crypto.randomUUID(),
      campaignName: user.companyName || "unknown",
      recipient: formattedPhone,
      message,
      messageId: response.data.messageId || crypto.randomUUID(),
      status: "sent",
      sentAt: new Date(),
      cost: response.data.cost || 0,
      response: JSON.stringify(response.data),
    });

    // Deduct credits and save
    user.smsCredits -= 1;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "SMS envoyé avec succès",
      data: {
        messageId: sms.messageId,
        remainingCredits: user.smsCredits,
        cost: sms.cost,
        status: sms.status,
      },
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    if (
      error instanceof Error &&
      "response" in error &&
      (error.response as any)?.data
    ) {
      return NextResponse.json(
        {
          error:
            "Erreur SMS Pro: " + JSON.stringify((error.response as any).data),
        },
        { status: (error.response as any)?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du SMS" },
      { status: 500 }
    );
  }
}
