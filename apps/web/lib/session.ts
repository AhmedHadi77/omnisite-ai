import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export const demoUserId = "demo-owner";
export const demoWorkspaceId = "growthops-workspace";

export type AppSession = {
  userId: string;
  workspaceId: string;
  userName: string;
  email: string;
  agencyName: string;
};

export async function getCurrentSession(): Promise<AppSession> {
  if (clerkIsConfigured()) {
    return getClerkSession();
  }

  return getDemoSession();
}

async function getDemoSession() {
  const workspace = await prisma.workspace.findFirst({
    where: { id: demoWorkspaceId, ownerId: demoUserId },
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

async function getClerkSession() {
  const { isAuthenticated, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    return redirectToSignIn();
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    `${user.id}@clerk.local`;
  const name =
    user.fullName ??
    [user.firstName, user.lastName].filter(Boolean).join(" ") ??
    user.username ??
    email.split("@")[0] ??
    "Workspace Owner";
  const agencyName = `${name}'s Workspace`;

  return ensureWorkspaceSession({
    name,
    email,
    agencyName,
    preferredUserId: user.id
  });
}

function clerkIsConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
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

  return {
    userId: user.id,
    workspaceId: workspace.id,
    userName: user.name,
    email: user.email,
    agencyName: workspace.agencyName
  };
}
