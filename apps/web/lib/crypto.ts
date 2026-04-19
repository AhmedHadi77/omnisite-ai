import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

type EncryptedSecret = {
  encryptedSecret: string;
  encryptionIv: string;
  encryptionTag: string;
};

function getEncryptionKey() {
  const key = process.env.CREDENTIAL_ENCRYPTION_KEY;

  if (!key) {
    throw new Error("Missing CREDENTIAL_ENCRYPTION_KEY environment variable.");
  }

  const buffer = Buffer.from(key, "base64");

  if (buffer.length !== 32) {
    throw new Error(
      "CREDENTIAL_ENCRYPTION_KEY must be a 32-byte base64 string."
    );
  }

  return buffer;
}

export function encryptSecret(secret: string): EncryptedSecret {
  if (!secret) {
    throw new Error("Cannot encrypt an empty secret.");
  }

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    encryptedSecret: encrypted.toString("base64"),
    encryptionIv: iv.toString("base64"),
    encryptionTag: tag.toString("base64"),
  };
}

export function decryptSecret(payload: EncryptedSecret): string {
  const key = getEncryptionKey();

  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(payload.encryptionIv, "base64")
  );

  decipher.setAuthTag(Buffer.from(payload.encryptionTag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.encryptedSecret, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
