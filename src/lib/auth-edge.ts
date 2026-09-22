/**
 * Edge-compatible auth helpers.
 *
 * Uses Web Crypto API (crypto.subtle) — works in Edge Runtime (middleware).
 * No node:crypto dependency. Full HMAC-SHA256 verification.
 */

const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours
const HMAC_ALGORITHM = "HMAC";
const HMAC_HASH = "SHA-256";

// ─── Environment helpers ──────────────────────────────────

function getEnv(name: string): string | null {
  return process.env[name] ?? null;
}

// ─── Web Crypto HMAC helpers ──────────────────────────────

/**
 * Derive an HMAC-SHA256 key from the hex-encoded OWNER_SESSION_SECRET.
 */
async function getHmacKey(): Promise<CryptoKey> {
  const secretHex = getEnv("OWNER_SESSION_SECRET");
  if (!secretHex) throw new Error("Missing OWNER_SESSION_SECRET");

  const secretBytes = hexToBytes(secretHex);
  const keyData = secretBytes.buffer as ArrayBuffer;

  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: HMAC_ALGORITHM, hash: HMAC_HASH },
    false,
    ["verify"],
  );
}

/**
 * Verify an HMAC-SHA256 signature over the given data.
 */
async function verifyHmac(
  key: CryptoKey,
  data: string,
  signatureHex: string,
): Promise<boolean> {
  const signatureBytes = hexToBytes(signatureHex);
  const dataBytes = new TextEncoder().encode(data);

  return crypto.subtle.verify(
    HMAC_ALGORITHM,
    key,
    signatureBytes.buffer as ArrayBuffer,
    dataBytes,
  );
}

// ─── Hex conversion ───────────────────────────────────────

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// ─── Constant-time comparison ─────────────────────────────

function constantTimeCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i]! ^ b[i]!;
  }
  return result === 0;
}

// ─── Session verification ─────────────────────────────────

/**
 * Verify a session cookie value using full HMAC-SHA256 verification.
 *
 * Checks:
 * 1. Format: exactly 3 colon-separated parts
 * 2. Username matches OWNER_USERNAME
 * 3. issuedAt is a valid integer
 * 4. Session has not exceeded 8-hour lifetime
 * 5. HMAC-SHA256 signature is valid
 * 6. Signature comparison is constant-time
 *
 * Returns the username if valid, null otherwise.
 */
export async function verifySession(
  cookieValue: string,
): Promise<string | null> {
  try {
    // 1. Parse format
    const parts = cookieValue.split(":");
    if (parts.length !== 3) return null;
    const [username, issuedAtStr, signatureHex] = parts;
    if (!username || !issuedAtStr || !signatureHex) return null;

    // 2. Verify username matches owner
    const expectedUsername = getEnv("OWNER_USERNAME");
    if (!expectedUsername) return null;

    const usernameBytes = new TextEncoder().encode(username);
    const expectedBytes = new TextEncoder().encode(expectedUsername);
    if (!constantTimeCompare(usernameBytes, expectedBytes)) return null;

    // 3. Verify issuedAt is valid
    const issuedAt = parseInt(issuedAtStr, 10);
    if (Number.isNaN(issuedAt)) return null;

    // 4. Verify session lifetime
    const now = Math.floor(Date.now() / 1000);
    if (now - issuedAt > SESSION_MAX_AGE_SECONDS) return null;

    // 5. Verify HMAC-SHA256 signature
    const key = await getHmacKey();
    const payload = `${username}:${issuedAtStr}`;
    const isValid = await verifyHmac(key, payload, signatureHex);

    if (!isValid) return null;

    return username;
  } catch {
    return null;
  }
}

// ─── Cookie reading ───────────────────────────────────────

/**
 * Read the session cookie value from a Request object.
 */
export function getSessionCookieValue(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const pairs = cookieHeader.split(";").map((c) => c.trim());

  for (const pair of pairs) {
    const eqIdx = pair.indexOf("=");
    if (eqIdx === -1) continue;
    const name = pair.slice(0, eqIdx).trim();
    const value = pair.slice(eqIdx + 1).trim();
    if (name === "session") {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }

  return null;
}
