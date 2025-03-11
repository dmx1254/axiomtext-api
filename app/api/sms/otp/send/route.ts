import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import crypto from "crypto";
import { verifyApiToken } from "@/lib/middleware/auth"; 
import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/user.model";
import OTPModel from "@/lib/models/otp.model";
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
    // console.log(authResult);

    if (authResult instanceof NextResponse) return authResult;

    // Get user and check solde
    const user = await UserModel.findById(authResult.userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { phone, signature } = body;

    // Validate input
    if (!phone) {
      return NextResponse.json(
        { error: "Numéro de téléphone requis" },
        { status: 400 }
      );
    }

    // Check solde
    if (user.smsCredits <= 0) {
      return NextResponse.json({ error: "Solde insuffisant" }, { status: 403 });
    }

    // Format phone number
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    // Generate OTP code (6 digits)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await OTPModel.create({
      phone: formattedPhone,
      code,
    });

    // Prepare message and API call parameters
    const message = `Votre code de vérification est: ${code}. Il expire dans 1 minute.`;
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
    await SMSModel.create({
      userId: authResult.userId,
      campaignId: "otp",
      campaignName: "OTP Verification",
      recipient: formattedPhone,
      message,
      messageId: response.data.messageId || crypto.randomUUID(),
      status: "sent",
      sentAt: new Date(),
      cost: response.data.cost || 0,
      response: JSON.stringify(response.data),
    });

    // Deduct credit and save
    user.smsCredits -= 1;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Code OTP envoyé avec succès",
      remainingCredits: user.smsCredits,
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    if (error.response?.data) {
      return NextResponse.json(
        { error: "Erreur SMS Pro: " + JSON.stringify(error.response.data) },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du code OTP" },
      { status: 500 }
    );
  }
}
