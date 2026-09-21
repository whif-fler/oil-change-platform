#!/usr/bin/env node

/**
 * One-time password hash generator for owner authentication.
 *
 * Usage:
 *   npx tsx scripts/generate-password-hash.ts
 *
 * Prompts for a password, generates a random salt, computes the PBKDF2 hash,
 * and prints the .env values to add to your .env file.
 *
 * This script does NOT store or print the password after generation.
 * It does NOT print the salt or hash until you enter the password.
 */

import crypto from "node:crypto";
import readline from "node:readline";

const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_KEY_LENGTH = 64;
const PBKDF2_DIGEST = "sha512";
const SALT_LENGTH = 32;

function promptPassword(rl: readline.Interface): Promise<string> {
  return new Promise((resolve) => {
    rl.question("Enter password: ", (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const password = await promptPassword(rl);

    if (!password) {
      console.error("Error: Password cannot be empty.");
      process.exit(1);
    }

    // Generate random salt
    const salt = crypto.randomBytes(SALT_LENGTH);

    // Derive hash
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEY_LENGTH,
      PBKDF2_DIGEST,
    );

    console.log("\n--- Add these to your .env file ---\n");
    console.log(`OWNER_USERNAME="admin"`);
    console.log(`OWNER_PASSWORD_SALT="${salt.toString("hex")}"`);
    console.log(`OWNER_PASSWORD_HASH="${hash.toString("hex")}"`);
    console.log(`OWNER_SESSION_SECRET="${crypto.randomBytes(32).toString("hex")}"`);
    console.log("\n--- Done ---\n");
    console.log("You can change OWNER_USERNAME to your preferred username.");
    console.log("The password is not stored anywhere — only the hash.");
  } finally {
    rl.close();
  }
}

main();
