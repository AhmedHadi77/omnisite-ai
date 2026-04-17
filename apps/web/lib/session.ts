import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const demoUserId = "demo-owner";
export const demoWorkspaceId = "growthops-workspace";

const userCookie = "omnisite_user_id";
const workspaceCookie = "omnisite_workspace_id";

export type AppSession = {
  userId: string;
  workspaceId: string;
  userName: string;
  email: string;
  agencyName: string;
};

export async function getCurrentSession(): Promise<AppSession> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(userCookie)?.value ?? demoUserId;
  const workspaceId = cookieStore.get(workspaceCookie)?.value ?? demoWorkspaceId;

  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, ownerId: userId },
    include: { owner: true }
  });

  if (workspace) {
    return {
      userId: workspace.ownerId,
      workspaceId: workspace.id,
      userName: workspace.owner.name,
      email: workspace.owner.email,
      agencyName: workspace.agencyName
    };
  }

  return ensureWorkspaceSession({
    name: "Ahmed",
    email: "ahmed@example.com",
    agencyName: "GrowthOps Studio",
    preferredUserId: demoUserId,
    preferredWorkspaceId: demoWorkspaceId
  });
}

export async function createSession(input: { name: string; email: string; agencyName: string }) {
  const session = await ensureWorkspaceSession(input);
  const cookieStore = await cookies();

  cookieStore.set(userCookie, session.userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  cookieStore.set(workspaceCookie, session.workspaceId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  return session;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(userCookie);
  cookieStore.delete(workspaceCookie);
}

async function ensureWorkspaceSession(input: {
  name: string;
  email: string;
  agencyName: string;
  preferredUserId?: string;
  preferredWorkspaceId?: string;
}): Promise<AppSession> {
  const user = await prisma.user.upsert({
    where: { email: input.email },
    update: {
      name: input.name
    },
    create: {
      id: input.preferredUserId,
      name: input.name,
      email: input.email,
      role: "OWNER"
    }
  });

  const workspace =
    (await prisma.workspace.findFirst({
      where: { ownerId: user.id },
      orderBy: { createdAt: "asc" }
    })) ??
    (await prisma.workspace.create({
      data: {
        id: input.preferredWorkspaceId,
        ownerId: user.id,
        agencyName: input.agencyName
      }
    }));

  if (workspace.agencyName !== input.agencyName && input.agencyName.trim().length > 0) {
    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { agencyName: input.agencyName }
    });
  }

  return {
    userId: user.id,
    workspaceId: workspace.id,
    userName: user.name,
    email: user.email,
    agencyName: input.agencyName || workspace.agencyName
  };
}
