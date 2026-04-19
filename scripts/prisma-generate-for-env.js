const { spawnSync } = require("node:child_process");

const databaseUrl = process.env.DATABASE_URL || "";
const isPostgres = databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
const args = isPostgres
  ? ["prisma", "generate", "--schema", "prisma/schema.postgres.prisma"]
  : ["prisma", "generate"];

console.log(`Generating Prisma Client for ${isPostgres ? "PostgreSQL" : "SQLite"}...`);

const result = spawnSync("npx", args, {
  shell: true,
  stdio: "inherit"
});

process.exit(result.status ?? 1);
