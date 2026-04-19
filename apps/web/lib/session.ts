import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

const sessionCookieName = "omnisite_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;
const appHome = "/connected-sites?flow=started";

export const demoUserId = "demo-owner";
export const demoWorkspaceId = "growthops-workspace";

export type AppSession = {
  userId: string;
  workspaceId: string;
  userName: string;
  email: string;
  agencyName: string;
};

export type AuthResult =
  | { ok: true }
  | {
      ok: false;
      reason: "account_exists" | "invalid_credentials" | "invalid_email" | "weak_password";
    };

export async function getCurrentSession(): Promise<AppSession> {
  const cookieStore = await cookies();
  const verified = verifySessionCookie(cookieStore.get(sessionCookieName)?.value);

  if (!verified) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    include: {
      workspaces: {
        orderBy: { createdAt: "asc" },
        take: 1
      }
    }
  });

  if (!user) {
    redirect("/sign-in");
  }

  const workspace =
    user.workspaces[0] ??
    (await prisma.workspace.create({
      data: {
        ownerId: user.id,
        agencyName: `${user.name}'s Workspace`
      }
    }));

  return {
    userId: user.id,
    workspaceId: workspace.id,
    userName: user.name,
    email: user.email,
    agencyName: workspace.agencyName
  };
}

export async function createAccountSession(input: {
  name: string;
  username: string;
  email: string;
  password: string;
  agencyName: string;
}): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) {
    return { ok: false, reason: "invalid_email" };
  }

  if (input.password.trim().length < 8) {
    return { ok: false, reason: "weak_password" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { ok: false, reason: "account_exists" };
  }

  const name = cleanName(input.name || input.username || email.split("@")[0]);
  const workspaceName = cleanName(input.agencyName || `${name}'s Workspace`);

  const user = await prisma.user.create({
    data: {
      name,
      username: cleanUsername(input.username),
      email,
      role: "OWNER",
      passwordHash: hashPassword(input.password),
      workspaces: {
        create: {
          agencyName: workspaceName
        }
      }
    }
  });

  await setSessionCookie(user.id);
  return { ok: true };
}

export async function signInWithPassword(input: { email: string; password: string }): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) {
    return { ok: false, reason: "invalid_email" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
    return { ok: false, reason: "invalid_credentials" };
  }

  await setSessionCookie(user.id);
  return { ok: true };
}

export async function clearCurrentSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export function getAuthHome() {
  return appHome;
}

async function setSessionCookie(userId: string) {
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const payload = `${userId}.${expiresAt}`;
  const signature = signPayload(payload);
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAgeSeconds,
    path: "/"
  });
}

function verifySessionCookie(value?: string) {
  if (!value) return null;

  const [userId, expiresAtValue, signature] = value.split(".");
  if (!userId || !expiresAtValue || !signature) return null;

  const expiresAt = Number(expiresAtValue);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const payload = `${userId}.${expiresAtValue}`;
  const expectedSignature = signPayload(payload);

  if (!safeEqual(signature, expectedSignature)) return null;
  return { userId };
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function getSessionSecret() {
  return process.env.AUTH_SECRET || process.env.CREDENTIAL_ENCRYPTION_KEY || "omnisite-dev-auth-secret";
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [scheme, salt, hash] = storedHash.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64url");
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  if (valueBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(valueBuffer, expectedBuffer);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanUsername(username: string) {
  return username.trim().replace(/^@/, "").slice(0, 40);
}

function cleanName(name: string) {
  return name.trim().slice(0, 90) || "Workspace Owner";
}
