import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyApiToken } from "@/lib/middleware/auth";
import { connectDB } from "@/lib/db";
import OTPModel from "@/lib/models/otp.model";

await connectDB();
export async function POST(request: NextRequest) {
  try {
    // Verify API token
    const authResult = await verifyApiToken(request);
    if (authResult instanceof NextResponse) return authResult;

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

    // Format phone number
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    // Find the most recent unverified OTP for this phone number
    const otp = await OTPModel.findOne({
      phone: formattedPhone,
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
