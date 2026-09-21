import { NextResponse } from "next/server";
import { verifyUsername, verifyPassword, createSessionCookie, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  // Content type check
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_CONTENT_TYPE", message: "Expected application/json." } },
      { status: 400 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "MALFORMED_JSON", message: "Request body is not valid JSON." } },
      { status: 400 },
    );
  }

  const { username, password } = body as { username?: string; password?: string };

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: { code: "VALIDATION_ERROR", message: "Username and password are required." } },
      { status: 422 },
    );
  }

  // Verify credentials
  if (!verifyUsername(username) || !verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Invalid username or password." } },
      { status: 401 },
    );
  }

  // Create session
  const sessionValue = createSessionCookie(username);
  await setSessionCookie(sessionValue);

  return NextResponse.json({ ok: true, data: { redirectTo: "/dashboard" } });
}
