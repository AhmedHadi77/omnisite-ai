import { ArrowUpRight, Bot, ClipboardList, Gauge, KeyRound, ShieldCheck, Zap } from "lucide-react";
import { notFound } from "next/navigation";
import { AppPageHero, AppStatCard, MetricStrip } from "../../../../components/app/page-chrome";
import { normalizePlatform } from "../../../../lib/dashboard-data";
import { prisma } from "../../../../lib/prisma";
import { getCurrentSession } from "../../../../lib/session";

export default async function SiteDetailsPage({ params }: { params: Promise<{ siteId: string }> }) {
  const [{ siteId }, session] = await Promise.all([params, getCurrentSession()]);
  const site = await prisma.connectedSite.findFirst({
    where: {
      id: siteId,
      workspaceId: session.workspaceId
    },
    include: {
      credential: true,
      audits: {
        orderBy: { createdAt: "desc" },
        take: 3
      },
      tasks: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });

  if (!site) {
    notFound();
  }

  const platform = normalizePlatform(site.platform);
  const credentialStatus = site.credential?.secretStored ? "Credential saved" : "Needs credential";
  const scoreAverage = Math.round((site.seoScore + site.uxScore + site.speedScore) / 3);

  return (
    <main className="page-enter">
      <AppPageHero
        accent="teal"
        action={
          <>
            <a className="btn-accent" href="/ai-audit">
              <Bot className="h-4 w-4" />
              Run AI audit
            </a>
            <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/connected-sites">
              All sites
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </>
        }
        description={`${site.domain} is connected to ${session.agencyName} with platform metrics, credential state, audit history, and delivery tasks.`}
        eyebrow={`${platform} site details`}
        image={site.imageUrl}
        title={site.siteName}
      >
        <p className="text-xs font-black uppercase text-citron">Site health</p>
        <h2 className="mt-2 text-3xl font-black">{scoreAverage}% average score</h2>
        <p className="mt-3 text-sm leading-6 text-cloud/68">
          Last sync: {site.lastSyncLabel}. Owner: {site.ownerName}.
        </p>
        <div className="mt-5">
          <MetricStrip
            items={[
              { label: "SEO", value: site.seoScore.toString(), accent: "teal" },
              { label: "UX", value: site.uxScore.toString(), accent: "citron" },
              { label: "Speed", value: site.speedScore.toString(), accent: "coral" }
            ]}
          />
        </div>
      </AppPageHero>

      <section className="motion-list mt-6 grid gap-4 md:grid-cols-3">
        <AppStatCard icon={<Gauge className="h-5 w-5" />} label="Health score" note={site.status} value={`${site.healthScore}%`} />
        <AppStatCard accent="citron" icon={<ClipboardList className="h-5 w-5" />} label="Tasks" note="Latest linked work" value={site.tasks.length.toString()} />
        <AppStatCard accent="coral" icon={<KeyRound className="h-5 w-5" />} label="Credential" note={site.credential?.lastTestStatus ?? "NOT_TESTED"} value={credentialStatus} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_420px]">
        <section className="surface motion-card overflow-hidden">
          <div className="border-b border-ink/10 p-5">
            <p className="text-sm font-black uppercase text-teal">Performance profile</p>
            <h2 className="mt-1 text-3xl font-black">Platform scores</h2>
          </div>
          <div className="grid gap-0">
            <ScoreRow label="SEO readiness" value={site.seoScore} />
            <ScoreRow label="UX clarity" value={site.uxScore} />
            <ScoreRow label="Speed health" value={site.speedScore} />
            <ScoreRow label="Overall health" value={site.healthScore} />
          </div>
        </section>

        <section className="scan-panel motion-card rounded-ui bg-graphite p-5 text-cloud shadow-2xl shadow-graphite/15">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-citron">Credential status</p>
              <h2 className="mt-2 text-3xl font-black">{credentialStatus}</h2>
            </div>
            <ShieldCheck className="h-7 w-7 text-citron" />
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            <CredentialRow label="Auth type" value={site.credential?.authType ?? "Not added"} />
            <CredentialRow label="Account label" value={site.credential?.accountLabel ?? "No label"} />
            <CredentialRow label="API base URL" value={site.credential?.apiBaseUrl ?? "Not configured"} />
            <CredentialRow label="Token preview" value={site.credential?.tokenPreview || "No token preview"} />
            <CredentialRow label="Scopes" value={site.credential?.scopes || "No scopes recorded"} />
          </div>
        </section>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        <section className="surface motion-card overflow-hidden">
          <div className="border-b border-ink/10 p-5">
            <p className="text-sm font-black uppercase text-moss">Latest tasks</p>
            <h2 className="mt-1 text-3xl font-black">Work attached to this site</h2>
          </div>
          <div className="motion-list grid gap-3 p-5">
            {site.tasks.length ? (
              site.tasks.map((task) => (
                <article className="hover-lift rounded-ui border border-ink/10 bg-white/45 p-4" key={task.id}>
                  <div className="flex flex-wrap gap-2">
                    <span className="status-pill bg-paper text-moss">{humanPriority(task.priority)}</span>
                    <span className="status-pill bg-paper text-steel">{humanTaskStatus(task.status)}</span>
                    <span className="status-pill bg-teal/10 text-teal">{task.impact}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-black">{task.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{task.description}</p>
                </article>
              ))
            ) : (
              <EmptyState label="No tasks yet" title="Run an AI audit to create site-specific work." />
            )}
          </div>
        </section>

        <section className="surface motion-card overflow-hidden">
          <div className="border-b border-ink/10 p-5">
            <p className="text-sm font-black uppercase text-coral">Audit history</p>
            <h2 className="mt-1 text-3xl font-black">Recent intelligence</h2>
          </div>
          <div className="motion-list grid gap-3 p-5">
            {site.audits.length ? (
              site.audits.map((audit) => (
                <article className="hover-lift rounded-ui border border-ink/10 bg-white/45 p-4" key={audit.id}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="status-pill bg-coral/10 text-coral">AI summary</span>
                    <span className="text-xs font-black uppercase text-steel">{Math.round((audit.seoScore + audit.uxScore + audit.speedScore) / 3)}% confidence</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-steel">{audit.aiSummary}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-ui bg-paper">
                    <div className="motion-bar h-full rounded-ui bg-citron" style={{ width: `${Math.round((audit.seoScore + audit.uxScore + audit.speedScore) / 3)}%` }} />
                  </div>
                </article>
              ))
            ) : (
              <EmptyState label="No audits yet" title="The first audit summary will appear here." />
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid gap-3 border-b border-ink/10 p-5 last:border-b-0 md:grid-cols-[180px_1fr_64px] md:items-center">
      <p className="text-sm font-black uppercase text-steel">{label}</p>
      <div className="h-2 overflow-hidden rounded-ui bg-paper">
        <div className="motion-bar h-full rounded-ui bg-teal" style={{ width: `${value}%` }} />
      </div>
      <p className="font-black text-moss md:text-right">{value}%</p>
    </div>
  );
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-ui border border-cloud/10 bg-cloud/6 p-3">
      <p className="text-xs font-black uppercase text-cloud/50">{label}</p>
      <p className="mt-1 break-words font-bold text-cloud/82">{value}</p>
    </div>
  );
}

function EmptyState({ label, title }: { label: string; title: string }) {
  return (
    <div className="grid min-h-48 place-items-center text-center">
      <div>
        <p className="text-sm font-black uppercase text-teal">{label}</p>
        <h3 className="mt-2 text-2xl font-black">{title}</h3>
      </div>
    </div>
  );
}

function humanPriority(priority: string) {
  if (priority === "HIGH") return "High";
  if (priority === "LOW") return "Low";
  return "Medium";
}

function humanTaskStatus(status: string) {
  if (status === "IN_PROGRESS") return "In progress";
  if (status === "IN_REVIEW") return "Review";
  return "Queued";
}
