import { NextRequest, NextResponse } from "next/server";
import { MODULE_KEYS } from "@/lib/constants";

const AUTH_UI_URL =
  process.env.NEXT_PUBLIC_AUTH_UI_URL ?? "http://localhost:4005/?app=kycv1";
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5000";
const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY ?? "";
const MAX_AGE = 60 * 60; // 1 hour

interface ExchangeResponse {
  token: string;
  email: string;
  name: string;
  userId: string;
  modules: string[];
  expiresAt: string;
  issuedAt: string;
}

/**
 * GET /auth/callback?code=...
 *
 * Exchanges the code with the backend (same pattern as ekyc generic-portal).
 * Backend endpoint: GET /api/Authentication/callback?code=...
 * On success: sets auth_token + user_info cookies → redirects to /dashboard.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL(AUTH_UI_URL));
  }

  let name = "";
  let email = "";
  let token = code; // fallback: use code directly if exchange fails

  try {
    const exchangeUrl = new URL("/api/auth/callback", API_BASE_URL);
    exchangeUrl.searchParams.set("code", code);

    console.log(
      "[auth/callback] exchanging with backend:",
      exchangeUrl.toString(),
    );

    const res = await fetch(exchangeUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": X_API_KEY,
      },
    });

    console.log("[auth/callback] status:", res.status);

    if (res.ok) {
      const json: ExchangeResponse = await res.json();
      console.log("[auth/callback] exchange response:", json);

      name = json.name ?? "";
      email = json.email ?? "";
      token = json.token ?? token;
    } else {
      const body = await res.text();
      console.error(
        "[auth/callback] exchange failed — status:",
        res.status,
        "| body:",
        body,
      );
    }
  } catch (err) {
    console.error("[auth/callback] fetch error:", err);
  }

  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  // httpOnly: true → JS cannot read this. XSS cannot steal it.
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  // Readable by AuthContext for client hydration
  response.cookies.set(
    "user_info",
    JSON.stringify({ name, email, modules: Object.values(MODULE_KEYS) }),
    {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    },
  );

  return response;
}
