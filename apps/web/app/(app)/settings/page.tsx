import { AlertTriangle, CheckCircle2, DatabaseZap, KeyRound, PlugZap, Settings, ShieldCheck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { AppPageHero, AppStatCard, MetricStrip } from "../../../components/app/page-chrome";
import { getDashboardData } from "../../../lib/dashboard-data";
import { getCurrentSession } from "../../../lib/session";

export default async function SettingsPage() {
  const [session, dashboard] = await Promise.all([getCurrentSession(), getDashboardData()]);
  const savedCredentials = dashboard.sites.filter((site) => site.credentialStatus === "Credential saved").length;
  const connectedSites = dashboard.sites.filter((site) => site.status === "Connected").length;
  const readiness = getProductionReadiness(savedCredentials);

  return (
    <main className="page-enter">
      <AppPageHero
        accent="citron"
        action={
          <>
            <a className="btn-accent" href="/connected-sites">
              <PlugZap className="h-4 w-4" />
              Manage integrations
            </a>
            <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/dashboard">
              Back to dashboard
            </a>
          </>
        }
        description="Review workspace ownership, integration readiness, API environment status, and demo credentials before deployment."
        eyebrow="Settings"
        image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=85"
        title="Workspace control room for launch readiness."
      >
        <p className="text-xs font-black uppercase text-citron">Current workspace</p>
        <h2 className="mt-2 text-3xl font-black">{session.agencyName}</h2>
        <p className="mt-3 text-sm leading-6 text-cloud/68">
          Owned by {session.userName}. Built-in secure auth is active and scoped to this workspace.
        </p>
        <div className="mt-5">
          <MetricStrip
            items={[
              { label: "Sites", value: dashboard.sites.length.toString(), accent: "teal" },
              { label: "Saved keys", value: savedCredentials.toString(), accent: "citron" },
              { label: "Tasks", value: dashboard.tasks.length.toString(), accent: "coral" }
            ]}
          />
        </div>
      </AppPageHero>

      <section className="motion-list mt-6 grid gap-4 md:grid-cols-3">
        <AppStatCard icon={<UserRound className="h-5 w-5" />} label="Owner" note={session.email} value={session.userName} />
        <AppStatCard accent="citron" icon={<ShieldCheck className="h-5 w-5" />} label="Connected sites" note="API status passed" value={`${connectedSites}/${dashboard.sites.length}`} />
        <AppStatCard accent="coral" icon={<KeyRound className="h-5 w-5" />} label="Credentials" note="Encrypted secrets with masked previews" value={`${savedCredentials}/${dashboard.sites.length}`} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_420px]">
        <section className="surface motion-card overflow-hidden">
          <div className="border-b border-ink/10 p-5">
            <p className="text-sm font-black uppercase text-teal">Workspace profile</p>
            <h2 className="mt-1 text-3xl font-black">Agency operating context</h2>
          </div>
          <div className="grid gap-0">
            <SettingRow label="Agency name" value={session.agencyName} />
            <SettingRow label="Owner name" value={session.userName} />
            <SettingRow label="Owner email" value={session.email} />
            <SettingRow label="Workspace ID" value={session.workspaceId} />
          </div>
        </section>

        <section className="scan-panel motion-card rounded-ui bg-graphite p-5 text-cloud shadow-2xl shadow-graphite/15">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-citron">Deployment checklist</p>
              <h2 className="mt-2 text-3xl font-black">{readiness.done}/{readiness.items.length} ready</h2>
              <p className="mt-2 text-sm leading-6 text-cloud/65">
                This reads your server environment and workspace records. Secrets stay hidden.
              </p>
            </div>
            <Settings className="h-7 w-7 text-citron" />
          </div>
          <div className="mt-5 grid gap-3">
            {readiness.items.map((item) => (
              <ChecklistItem
                detail={item.detail}
                done={item.done}
                icon={item.icon}
                key={item.label}
                label={item.label}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function getProductionReadiness(savedCredentials: number) {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const hasPostgresDatabase = databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);
  const hasEncryptionKey = Boolean(process.env.CREDENTIAL_ENCRYPTION_KEY);
  const hasRealAuth = Boolean(process.env.AUTH_SECRET || process.env.CREDENTIAL_ENCRYPTION_KEY);
  const hasEncryptedCredentials = hasEncryptionKey && savedCredentials > 0;

  const items = [
    {
      done: hasPostgresDatabase,
      icon: <DatabaseZap className="h-4 w-4" />,
      label: hasPostgresDatabase ? "Hosted PostgreSQL connected" : "Move DATABASE_URL to hosted PostgreSQL",
      detail: hasPostgresDatabase ? "DATABASE_URL is using PostgreSQL." : "This environment is still using local SQLite."
    },
    {
      done: hasOpenAi,
      icon: <KeyRound className="h-4 w-4" />,
      label: hasOpenAi ? "OpenAI API key detected" : "Add OPENAI_API_KEY for live audit text",
      detail: hasOpenAi ? `AI audits can use ${process.env.OPENAI_MODEL ?? "the default model"}.` : "AI audit will use fallback content until this is set."
    },
    {
      done: hasEncryptedCredentials,
      icon: <PlugZap className="h-4 w-4" />,
      label: hasEncryptedCredentials ? "Encrypted platform credentials saved" : "Add encrypted Webflow, WordPress, or Shopify credentials",
      detail: hasEncryptedCredentials
        ? `${savedCredentials} site${savedCredentials === 1 ? "" : "s"} have encrypted secrets saved.`
        : hasEncryptionKey
          ? "Encryption is ready. Add a new site with a real platform token."
          : "Add CREDENTIAL_ENCRYPTION_KEY before saving real platform tokens."
    },
    {
      done: hasRealAuth,
      icon: <ShieldCheck className="h-4 w-4" />,
      label: hasRealAuth ? "Secure auth secret detected" : "Add AUTH_SECRET for production auth",
      detail: hasRealAuth
        ? "First-party email/password sessions are signed with a server secret."
        : "Add AUTH_SECRET in Vercel so production sessions are private and stable."
    }
  ];

  return {
    done: items.filter((item) => item.done).length,
    items
  };
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-b border-ink/10 p-5 last:border-b-0 md:grid-cols-[180px_1fr] md:items-center">
      <p className="text-sm font-black uppercase text-steel">{label}</p>
      <p className="break-words font-black text-moss">{value}</p>
    </div>
  );
}

function ChecklistItem({ detail, done, icon, label }: { detail: string; done: boolean; icon: ReactNode; label: string }) {
  return (
    <div className="flex items-start gap-3 rounded-ui border border-cloud/10 bg-cloud/6 p-3 text-sm text-cloud/78">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-ui ${done ? "bg-citron text-ink" : "bg-coral text-ink"}`}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 font-black text-cloud">
          {done ? <CheckCircle2 className="h-4 w-4 text-citron" /> : <AlertTriangle className="h-4 w-4 text-coral" />}
          {label}
        </span>
        <span className="mt-1 block leading-5 text-cloud/58">{detail}</span>
      </span>
    </div>
  );
}
