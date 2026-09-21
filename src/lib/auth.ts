/**
 * Owner-only authentication utilities.
 *
 * Uses environment-variable credentials (OWNER_USERNAME, OWNER_PASSWORD_HASH,
 * OWNER_PASSWORD_SALT, OWNER_SESSION_SECRET) and signed HttpOnly cookies.
 *
 * No database sessions. No new dependencies. Node.js built-in crypto only.
 */

import { cookies } from "next/headers";
import crypto from "node:crypto";

// ─── Constants ────────────────────────────────────────────

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_KEY_LENGTH = 64;
const PBKDF2_DIGEST = "sha512";
const HMAC_ALGORITHM = "sha256";

// ─── Environment helpers ──────────────────────────────────

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// ─── Password verification ────────────────────────────────

/**
 * Verify a plaintext password against the stored PBKDF2 hash.
 * Uses constant-time comparison to prevent timing attacks.
 */
export function verifyPassword(password: string): boolean {
  const hash = requireEnv("OWNER_PASSWORD_HASH");
  const salt = Buffer.from(requireEnv("OWNER_PASSWORD_SALT"), "hex");

  const derived = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEY_LENGTH,
    PBKDF2_DIGEST,
  );

  const stored = Buffer.from(hash, "hex");

  if (derived.length !== stored.length) {
    return false;
  }

  return crypto.timingSafeEqual(derived, stored);
}

/**
 * Verify the owner username.
 */
export function verifyUsername(username: string): boolean {
  const expected = requireEnv("OWNER_USERNAME");
  return crypto.timingSafeEqual(
    Buffer.from(username),
    Buffer.from(expected),
  );
}

// ─── Session cookie signing ───────────────────────────────

function getSessionKey(): Buffer {
  return Buffer.from(requireEnv("OWNER_SESSION_SECRET"), "hex");
}

function signPayload(payload: string): string {
  const key = getSessionKey();
  const hmac = crypto.createHmac(HMAC_ALGORITHM, key);
  hmac.update(payload);
  return hmac.digest("hex");
}

/**
 * Create a signed session cookie value: <username>:<issuedAt>:<signature>
 */
export function createSessionCookie(username: string): string {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const payload = `${username}:${issuedAt}`;
  const signature = signPayload(payload);
  return `${payload}:${signature}`;
}

/**
 * Verify and parse a session cookie value.
 * Returns the username if valid, null otherwise.
 *
 * Validates:
 * - format (3 parts)
 * - HMAC signature (constant-time)
 * - session lifetime (<= SESSION_MAX_AGE_SECONDS)
 */
export function verifySessionCookie(cookieValue: string): string | null {
  const parts = cookieValue.split(":");
  if (parts.length !== 3) return null;

  const [username, issuedAtStr, signature] = parts;

  if (!username || !issuedAtStr || !signature) return null;

  // Verify issuedAt is a valid integer
  const issuedAt = parseInt(issuedAtStr, 10);
  if (Number.isNaN(issuedAt)) return null;

  // Verify signature
  const payload = `${username}:${issuedAtStr}`;
  const expectedSignature = signPayload(payload);

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (sigBuffer.length !== expectedBuffer.length) return false as unknown as null;

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  // Verify session lifetime
  const now = Math.floor(Date.now() / 1000);
  if (now - issuedAt > SESSION_MAX_AGE_SECONDS) return null;

  return username;
}

// ─── Cookie helpers (Next.js App Router) ──────────────────

/**
 * Set the session cookie on the response.
 */
export async function setSessionCookie(value: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clear the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Read and verify the session cookie from the request.
 * Returns the username if valid, null otherwise.
 */
export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return null;
  return verifySessionCookie(session.value);
}

// ─── Middleware helpers (no Next.js cookies() API) ────────

/**
 * Read the session cookie from a Request object (for middleware use).
 * Returns the username if valid, null otherwise.
 */
export function getSessionUserFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = cookieHeader.split(";").map((c) => c.trim());

  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split("=");
    if (name === SESSION_COOKIE_NAME) {
      const value = rest.join("=");
      return verifySessionCookie(value);
    }
  }

  return null;
}
