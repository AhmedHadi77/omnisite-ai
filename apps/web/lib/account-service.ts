import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./password";

export type AuthResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      reason: "account_exists" | "invalid_credentials" | "invalid_email" | "weak_password";
    };

export type AppSession = {
  userId: string;
  workspaceId: string;
  userName: string;
  email: string;
  agencyName: string;
};

export async function createPasswordAccount(input: {
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
  if (existingUser?.passwordHash) {
    return { ok: false, reason: "account_exists" };
  }

  const name = cleanName(input.name || input.username || email.split("@")[0]);
  const workspaceName = cleanName(input.agencyName || `${name}'s Workspace`);

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          username: cleanUsername(input.username || existingUser.username),
          passwordHash: hashPassword(input.password)
        }
      })
    : await prisma.user.create({
        data: {
          name,
          username: cleanUsername(input.username),
          email,
          role: "OWNER",
          passwordHash: hashPassword(input.password)
        }
      });

  await ensureWorkspace(user.id, workspaceName);
  return { ok: true, userId: user.id };
}

export async function validatePasswordAccount(input: { email: string; password: string }): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) {
    return { ok: false, reason: "invalid_email" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
    return { ok: false, reason: "invalid_credentials" };
  }

  await ensureWorkspace(user.id, `${user.name}'s Workspace`);
  return { ok: true, userId: user.id };
}

export async function ensureOAuthUser(input: { email: string; name?: string | null; username?: string | null }) {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) return null;

  const name = cleanName(input.name || input.username || email.split("@")[0]);
  const username = cleanUsername(input.username || email.split("@")[0]);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      username
    },
    create: {
      name,
      username,
      email,
      role: "OWNER",
      passwordHash: ""
    }
  });

  await ensureWorkspace(user.id, `${name}'s Workspace`);
  return user;
}

export async function getAppSessionForUser(input: { userId?: string; email?: string | null }): Promise<AppSession | null> {
  const userById = input.userId
    ? await prisma.user.findUnique({
        where: { id: input.userId },
        include: { workspaces: { orderBy: { createdAt: "asc" }, take: 1 } }
      })
    : null;

  const user =
    userById ??
    (input.email
      ? await prisma.user.findUnique({
          where: { email: normalizeEmail(input.email) },
          include: { workspaces: { orderBy: { createdAt: "asc" }, take: 1 } }
        })
      : null);

  if (!user) return null;

  const workspace = user.workspaces[0] ?? (await ensureWorkspace(user.id, `${user.name}'s Workspace`));

  return {
    userId: user.id,
    workspaceId: workspace.id,
    userName: user.name,
    email: user.email,
    agencyName: workspace.agencyName
  };
}

async function ensureWorkspace(userId: string, agencyName: string) {
  return (
    (await prisma.workspace.findFirst({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" }
    })) ??
    (await prisma.workspace.create({
      data: {
        ownerId: userId,
        agencyName
      }
    }))
  );
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
