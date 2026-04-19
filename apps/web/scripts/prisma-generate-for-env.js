const { spawnSync } = require("node:child_process");

const databaseUrl = process.env.DATABASE_URL || "";
const isPostgres = databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
const schema = isPostgres ? "../../prisma/schema.postgres.prisma" : "../../prisma/schema.prisma";

console.log(`Generating Prisma Client for ${isPostgres ? "PostgreSQL" : "SQLite"}...`);

const result = spawnSync("npx", ["prisma", "generate", "--schema", schema], {
  shell: true,
  stdio: "inherit"
});

process.exit(result.status ?? 1);
