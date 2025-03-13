import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import APITokenModel from "../models/apiToken.model";
import { connectDB } from "../db";
import crypto from "crypto";
import UserModel from "../models/user.model";
import RateLimitModel from "../models/rate.limit";

await connectDB();

const RATE_LIMIT = 1000; // requests per hour
const WINDOW_SIZE = 60 * 60 * 1000; // 1 hour in milliseconds

interface RateLimitInfo {
  isAllowed: boolean;
  remaining: number;
  reset: Date;
  limit: number;
}

async function checkRateLimit(key: string): Promise<RateLimitInfo> {
  const now = new Date();
  const resetAt = new Date(
    Math.ceil(now.getTime() / WINDOW_SIZE) * WINDOW_SIZE
  );

  const rateLimit = await RateLimitModel.findOneAndUpdate(
    {
      key,
      resetAt,
    },
    {
      $setOnInsert: { resetAt },
      $inc: { count: 1 },
    },
    {
      upsert: true,
      new: true,
    }
  );

  const remaining = Math.max(0, RATE_LIMIT - rateLimit.count);
  const isAllowed = rateLimit.count <= RATE_LIMIT;

  return {
    isAllowed,
    remaining,
    reset: resetAt,
    limit: RATE_LIMIT,
  };
}

function addRateLimitHeaders(
  response: NextResponse,
  rateLimitInfo: RateLimitInfo
) {
  response.headers.set("X-RateLimit-Limit", rateLimitInfo.limit.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    rateLimitInfo.remaining.toString()
  );
  response.headers.set(
    "X-RateLimit-Reset",
    rateLimitInfo.reset.getTime().toString()
  );

  // Add Retry-After header if rate limit is exceeded
  if (!rateLimitInfo.isAllowed) {
    const retryAfter = Math.ceil(
      (rateLimitInfo.reset.getTime() - Date.now()) / 1000
    );
    response.headers.set("Retry-After", retryAfter.toString());
  }
}

export async function verifyApiToken(request: NextRequest) {
  try {
    // Check IP-based rate limit first
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipRateLimit = await checkRateLimit(`ip:${ip}`);

    if (!ipRateLimit.isAllowed) {
      const response = NextResponse.json(
        { error: "Limite de requêtes dépassée pour cette IP" },
        { status: 429 }
      );
      addRateLimitHeaders(response, ipRateLimit);
      return response;
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      );
    }

    // Extract and hash the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Token invalide ou manquant" },
        { status: 402 }
      );
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find and verify token
    const apiToken = await APITokenModel.findOne({ hashedToken });
    if (!apiToken) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    if (!apiToken.isActive) {
      return NextResponse.json({ error: "Token désactivé" }, { status: 401 });
    }

    // Check user-based rate limit
    const userRateLimit = await checkRateLimit(`user:${apiToken.userId}`);
    if (!userRateLimit.isAllowed) {
      const response = NextResponse.json(
        { error: "Limite de requêtes dépassée pour cet utilisateur" },
        { status: 429 }
      );
      addRateLimitHeaders(response, userRateLimit);
      return response;
    }

    // Check is the company name is pending
    const isCompanyNameApproved = await UserModel.findById(apiToken.userId);
    if (isCompanyNameApproved?.companyNameStatus === "pending") {
      return NextResponse.json(
        { error: "Nom de société en attente de validation" },
        { status: 401 }
      );
    }

    // Check is the company name is rejected
    const isCompanyNameRejected = await UserModel.findById(apiToken.userId);
    if (isCompanyNameRejected?.companyNameStatus === "rejected") {
      return NextResponse.json(
        { error: "Nom de société rejeté" },
        { status: 401 }
      );
    }

    // Update last used timestamp
    apiToken.lastUsed = new Date();
    await apiToken.save();

    // Create successful response with rate limit headers
    const response = NextResponse.json({ userId: apiToken.userId });
    addRateLimitHeaders(response, userRateLimit);
    return { userId: apiToken.userId };
  } catch (error) {
    console.error("Error verifying API token:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification du token" },
      { status: 500 }
    );
  }
}
