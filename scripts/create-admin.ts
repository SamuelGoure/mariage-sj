import { config } from "dotenv";
config({ path: ".env.local" });
config();

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg?.slice(prefix.length);
}

async function main() {
  const email = getArg("email");
  const password = getArg("password");

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts --email=admin@example.com --password=secret");
    process.exit(1);
  }

  // Imports deferred until after dotenv has populated process.env, since
  // lib/prisma.ts reads DATABASE_URL at module-evaluation time and static
  // imports are hoisted above the config() calls above.
  const bcrypt = (await import("bcryptjs")).default;
  const { prisma } = await import("../lib/prisma");

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  });

  console.log(`Admin prêt : ${admin.email} (id ${admin.id})`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
