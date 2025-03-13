import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyApiToken } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db";
import OTPModel from "@/lib/models/otp.model";
import UserModel from "@/lib/models/user.model";

await connectDB();
export async function POST(request: NextRequest) {
  try {
    // Verify API token
    // Verify API token
    const authResult = await verifyApiToken(request);
    // console.log(authResult);

    const userId = (authResult as { userId: string }).userId;
    const user  = await UserModel.findById(userId)
    // Validate input
    if (!user) {
      return NextResponse.json(
        { error: "Votre token est invalide" },
        { status: 401 }
      );
    }


    // Parse request body
    const body = await request.json();
    const { phone, code } = body;

    // Validate input
    if (!phone || !code) {
      return NextResponse.json(
        { error: "Numéro de téléphone et code requis" },
        { status: 400 }
      );
    }

    // Find the most recent unverified OTP for this phone number
    const otp = await OTPModel.findOne({
      phone: phone,
      verified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    // console.log(otp);
    // console.log(formattedPhone);

    if (!otp) {
      return NextResponse.json(
        { error: "Code OTP expiré ou invalide" },
        { status: 400 }
      );
    }

    // Verify code
    if (otp.code !== code) {
      return NextResponse.json(
        { error: "Code OTP incorrect" },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    otp.verified = true;
    await otp.save();

    return NextResponse.json({
      success: true,
      message: "Code OTP vérifié avec succès",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification du code OTP" },
      { status: 500 }
    );
  }
}
