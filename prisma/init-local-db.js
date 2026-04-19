const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON;");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "username" TEXT NOT NULL DEFAULT '',
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL DEFAULT '',
      "role" TEXT NOT NULL DEFAULT 'OWNER',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
  `);

  await addColumnIfMissing("User", "username", "TEXT NOT NULL DEFAULT ''");
  await addColumnIfMissing("User", "passwordHash", "TEXT NOT NULL DEFAULT ''");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Workspace" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "ownerId" TEXT NOT NULL,
      "agencyName" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ConnectedSite" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "workspaceId" TEXT NOT NULL,
      "platform" TEXT NOT NULL,
      "siteName" TEXT NOT NULL,
      "domain" TEXT NOT NULL,
      "apiStatus" TEXT NOT NULL DEFAULT 'MOCKED',
      "status" TEXT NOT NULL DEFAULT 'Connected',
      "healthScore" INTEGER NOT NULL DEFAULT 75,
      "seoScore" INTEGER NOT NULL DEFAULT 75,
      "uxScore" INTEGER NOT NULL DEFAULT 75,
      "speedScore" INTEGER NOT NULL DEFAULT 75,
      "traffic" TEXT NOT NULL DEFAULT '0',
      "leads" INTEGER NOT NULL DEFAULT 0,
      "orders" INTEGER NOT NULL DEFAULT 0,
      "lastSyncLabel" TEXT NOT NULL DEFAULT 'Just now',
      "ownerName" TEXT NOT NULL DEFAULT 'Ops',
      "imageUrl" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "ConnectedSite_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SiteCredential" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "siteId" TEXT NOT NULL,
      "provider" TEXT NOT NULL,
      "authType" TEXT NOT NULL,
      "accountLabel" TEXT NOT NULL DEFAULT '',
      "apiBaseUrl" TEXT NOT NULL DEFAULT '',
      "externalSiteId" TEXT NOT NULL DEFAULT '',
      "username" TEXT NOT NULL DEFAULT '',
      "shopDomain" TEXT NOT NULL DEFAULT '',
      "tokenPreview" TEXT NOT NULL DEFAULT '',
      "encryptedSecret" TEXT NOT NULL DEFAULT '',
      "encryptionIv" TEXT NOT NULL DEFAULT '',
      "encryptionTag" TEXT NOT NULL DEFAULT '',
      "secretStored" BOOLEAN NOT NULL DEFAULT false,
      "scopes" TEXT NOT NULL DEFAULT '',
      "lastTestStatus" TEXT NOT NULL DEFAULT 'NOT_TESTED',
      "lastTestMessage" TEXT NOT NULL DEFAULT 'Connection has not been tested yet.',
      "lastTestedAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "SiteCredential_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "ConnectedSite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "SiteCredential_siteId_key" ON "SiteCredential"("siteId");
  `);

  await addColumnIfMissing("SiteCredential", "lastTestStatus", "TEXT NOT NULL DEFAULT 'NOT_TESTED'");
  await addColumnIfMissing("SiteCredential", "lastTestMessage", "TEXT NOT NULL DEFAULT 'Connection has not been tested yet.'");
  await addColumnIfMissing("SiteCredential", "lastTestedAt", "DATETIME");
  await addColumnIfMissing("SiteCredential", "encryptedSecret", "TEXT NOT NULL DEFAULT ''");
  await addColumnIfMissing("SiteCredential", "encryptionIv", "TEXT NOT NULL DEFAULT ''");
  await addColumnIfMissing("SiteCredential", "encryptionTag", "TEXT NOT NULL DEFAULT ''");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Audit" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "siteId" TEXT NOT NULL,
      "seoScore" INTEGER NOT NULL,
      "uxScore" INTEGER NOT NULL,
      "speedScore" INTEGER NOT NULL,
      "aiSummary" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Audit_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "ConnectedSite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Task" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "siteId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'TODO',
      "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
      "source" TEXT NOT NULL DEFAULT 'AI',
      "dueLabel" TEXT NOT NULL DEFAULT 'This week',
      "impact" TEXT NOT NULL DEFAULT 'Site health',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "Task_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "ConnectedSite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ContentSuggestion" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "siteId" TEXT NOT NULL,
      "pageName" TEXT NOT NULL,
      "originalText" TEXT NOT NULL,
      "suggestedText" TEXT NOT NULL,
      "platform" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ContentSuggestion_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "ConnectedSite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ClientRequest" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "workspaceId" TEXT NOT NULL,
      "requestTitle" TEXT NOT NULL,
      "requestBody" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'TODO',
      "ageLabel" TEXT NOT NULL DEFAULT 'Just now',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      CONSTRAINT "ClientRequest_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
}

async function addColumnIfMissing(table, column, definition) {
  const columns = await prisma.$queryRawUnsafe(`PRAGMA table_info("${table}")`);
  if (columns.some((item) => item.name === column)) return;
  await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition};`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Initialized OmniSite AI local SQLite tables.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
