import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Globe2,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Zap
} from "lucide-react";
import type { ReactNode } from "react";
import { getDashboardData } from "../../lib/dashboard-data";
import type { DemoSite, DemoTask } from "../../lib/demo-data";

const platformTone: Record<DemoSite["platform"], string> = {
  Webflow: "bg-teal text-white",
  WordPress: "bg-coral text-white",
  Shopify: "bg-citron text-ink"
};

const priorityTone: Record<DemoTask["priority"], string> = {
  High: "bg-coral text-white",
  Medium: "bg-teal text-white",
  Low: "bg-moss text-white"
};

export async function DashboardShell() {
  const { workspace, sites, tasks, clientRequests, auditFindings } = await getDashboardData();
  const averageHealth = sites.length ? Math.round(sites.reduce((sum, site) => sum + site.healthScore, 0) / sites.length) : 0;
  const urgentTasks = tasks.filter((task) => task.priority === "High");
  const reviewSites = sites.filter((site) => site.status !== "Connected");
  const connectedSites = sites.filter((site) => site.status === "Connected").length;
  const totalLeads = sites.reduce((sum, site) => sum + site.leads, 0);
  const primaryFinding = auditFindings[0];
  const featuredSite = sites[0];

  return (
    <main className="page-enter">
      <header className="scan-panel relative overflow-hidden rounded-ui bg-graphite p-5 text-cloud shadow-2xl shadow-graphite/15 md:p-7">
        <img
          alt="Dashboard command room"
          className="motion-image-pan absolute inset-0 h-full w-full object-cover opacity-[0.34]"
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/88 to-graphite/45" />
        <div className="motion-gradient absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(215,229,111,0.38),rgba(27,138,122,0.16),transparent_68%)] blur-2xl" />
        <div className="absolute right-12 top-12 hidden h-32 w-32 rounded-full border border-citron/30 xl:block">
          <span className="motion-orbit absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-citron shadow-[0_0_30px_rgba(215,229,111,0.85)]" />
        </div>
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1fr_390px] xl:items-center">
          <div>
            <p className="motion-title text-sm font-black uppercase text-citron">Dashboard</p>
            <h2 className="motion-title-delay mt-2 max-w-4xl font-[var(--font-display)] text-5xl leading-none md:text-6xl">
              Clear priorities for {workspace.agencyName}.
            </h2>
            <p className="motion-card mt-4 max-w-2xl text-lg leading-8 text-cloud/72">
              Track site health, client approvals, and AI-generated work without digging through every platform.
            </p>
            <div className="motion-card mt-7 flex flex-wrap gap-3">
              <a className="btn-accent motion-pulse" href="/ai-audit">
                <SearchCheck className="h-4 w-4" />
                Run AI audit
              </a>
              <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/connected-sites">
                <Globe2 className="h-4 w-4" />
                Add site
              </a>
            </div>
          </div>

          {featuredSite ? (
            <div className="motion-float relative hidden xl:block">
              <div className="scan-panel rounded-ui border border-cloud/15 bg-cloud/12 p-4 shadow-2xl shadow-ink/25 backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-ui">
                  <img alt={`${featuredSite.name} visual preview`} className="h-44 w-full object-cover" src={featuredSite.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                    <span className="status-pill bg-citron text-ink">
                      <Bot className="h-3 w-3" />
                      AI watching
                    </span>
                    <span className="status-pill bg-cloud/16 text-cloud">
                      <Zap className="h-3 w-3 text-citron" />
                      Live
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase text-citron">Live focus</p>
                    <h3 className="mt-1 text-2xl font-black">{featuredSite.name}</h3>
                  </div>
                  <span className="status-pill bg-citron text-ink">{featuredSite.healthScore}% health</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-ui bg-cloud/12">
                  <div className="motion-bar h-full rounded-ui bg-citron" style={{ width: `${featuredSite.healthScore}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <MiniMetric label="SEO" value={featuredSite.seoScore} />
                  <MiniMetric label="UX" value={featuredSite.uxScore} />
                  <MiniMetric label="Speed" value={featuredSite.speedScore} />
                </div>
              </div>
              <div className="motion-float-delay absolute -bottom-4 -left-5 rounded-ui bg-citron px-4 py-3 text-ink shadow-2xl">
                <p className="text-xs font-black uppercase">Generated tasks</p>
                <p className="text-2xl font-black">{tasks.length}</p>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <section className="motion-list mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusTile icon={<Gauge className="h-5 w-5" />} label="Average health" value={`${averageHealth}%`} note={`${sites.length} sites tracked`} />
        <StatusTile icon={<Globe2 className="h-5 w-5" />} label="Connected sites" value={`${connectedSites}/${sites.length}`} note={`${reviewSites.length} need review`} />
        <StatusTile icon={<ClipboardList className="h-5 w-5" />} label="Urgent tasks" value={urgentTasks.length.toString()} note={`${tasks.length} total tasks`} />
        <StatusTile icon={<MessageSquareText className="h-5 w-5" />} label="Client requests" value={clientRequests.length.toString()} note={`${totalLeads.toLocaleString()} leads tracked`} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5">
          <section className="surface motion-card overflow-hidden">
            <SectionHeader eyebrow="Connected sites" title="Site health by platform" actionHref="/connected-sites" actionLabel="Manage sites" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-ink/10 bg-paper/70 text-xs uppercase text-steel">
                    <th className="px-5 py-3">Site</th>
                    <th className="px-5 py-3">Platform</th>
                    <th className="px-5 py-3">Health</th>
                    <th className="px-5 py-3">Traffic</th>
                    <th className="px-5 py-3">Credential</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site) => (
                    <SiteRow key={site.domain} site={site} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface motion-card">
            <SectionHeader eyebrow="Agency queue" title="Highest priority tasks" actionHref="/tasks" actionLabel="Open tasks" />
            <div className="motion-list grid gap-3 p-5">
              {tasks.slice(0, 5).map((task) => (
                <TaskItem key={`${task.platform}-${task.title}`} task={task} />
              ))}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-5">
          <section className="motion-card rounded-ui bg-graphite p-5 text-cloud shadow-2xl shadow-graphite/15">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-citron">AI recommendation</p>
                <h3 className="mt-2 text-3xl font-bold">Next best action</h3>
              </div>
              <Sparkles className="h-6 w-6 text-citron" />
            </div>
            {primaryFinding ? (
              <div className="mt-5">
                <p className="status-pill bg-cloud/10 text-citron">
                  {primaryFinding.area} - {primaryFinding.confidence}% confidence
                </p>
                <h4 className="mt-4 text-xl font-bold">{primaryFinding.title}</h4>
                <p className="mt-3 text-sm leading-6 text-cloud/70">{primaryFinding.recommendation}</p>
              </div>
            ) : (
              <p className="mt-5 text-sm text-cloud/70">Run an audit to generate the next recommendation.</p>
            )}
            <a className="btn-accent mt-5" href="/ai-audit">
              Generate tasks
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </section>

          <section className="surface motion-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-moss">Client approvals</p>
                <h3 className="mt-2 text-2xl font-bold">Waiting room</h3>
              </div>
              <MessageSquareText className="h-6 w-6 text-moss" />
            </div>
            <div className="mt-5 grid gap-3">
              {clientRequests.slice(0, 3).map((request) => (
                <article className="border-t border-ink/10 pt-3" key={request.request}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{request.request}</p>
                    <span className="text-xs text-steel">{request.age}</span>
                  </div>
                  <p className="mt-2 text-xs font-black uppercase text-teal">{request.status}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="surface motion-card p-5">
            <p className="text-sm font-black uppercase text-teal">Readiness</p>
            <div className="mt-4 grid gap-3">
              <ReadinessItem good={sites.length > 0} label="Workspace has connected sites" />
              <ReadinessItem good={tasks.length > 0} label="AI tasks exist in database" />
              <ReadinessItem good={reviewSites.length === 0} label="All credentials are connected" />
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function StatusTile({ icon, label, value, note }: { icon: ReactNode; label: string; value: string; note: string }) {
  return (
    <article className="surface hover-lift p-5">
      <div className="flex items-center justify-between gap-3 text-teal">
        <p className="text-sm font-black uppercase text-steel">{label}</p>
        {icon}
      </div>
      <p className="mt-4 text-4xl font-black">{value}</p>
      <p className="mt-2 text-sm font-bold text-moss">{note}</p>
      <div className="mt-4 flex h-8 items-end gap-1">
        {[42, 66, 52, 78, 88, 70, 94].map((height, index) => (
          <span
            className="motion-bar flex-1 rounded-t-ui bg-gradient-to-t from-teal to-citron"
            key={`${label}-${height}-${index}`}
            style={{ height: `${height}%`, animationDelay: `${index * 60}ms` }}
          />
        ))}
      </div>
    </article>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-ui bg-cloud/10 p-3">
      <p className="text-[0.65rem] font-black uppercase text-cloud/58">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-ui bg-cloud/12">
        <div className="motion-bar h-full rounded-ui bg-citron" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  actionHref,
  actionLabel
}: {
  eyebrow: string;
  title: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-black uppercase text-teal">{eyebrow}</p>
        <h3 className="mt-1 text-3xl font-black">{title}</h3>
      </div>
      <a className="inline-flex items-center gap-2 text-sm font-black text-moss hover:text-teal" href={actionHref}>
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function SiteRow({ site }: { site: DemoSite }) {
  return (
    <tr className="border-b border-ink/10 transition hover:bg-paper/50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img alt={`${site.name} preview`} className="h-12 w-12 rounded-ui object-cover" src={site.image} />
          <div>
            <p className="font-black">{site.name}</p>
            <p className="text-sm text-steel">{site.domain}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className={`status-pill ${platformTone[site.platform]}`}>{site.platform}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex min-w-36 items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-ui bg-paper">
            <div className="motion-bar h-full rounded-ui bg-teal" style={{ width: `${site.healthScore}%` }} />
          </div>
          <span className="text-sm font-black">{site.healthScore}%</span>
        </div>
      </td>
      <td className="px-5 py-4 text-sm">
        <p className="font-black">{site.traffic}</p>
        <p className="text-steel">{site.leads} leads</p>
      </td>
      <td className="px-5 py-4 text-sm">
        <p className="font-black">{site.authType ?? "Not added"}</p>
        <p className="text-steel">{site.credentialPreview ?? "No token preview"}</p>
      </td>
      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-2 text-sm font-black text-moss">
          {site.status === "Connected" ? <CheckCircle2 className="h-4 w-4 text-teal" /> : <AlertTriangle className="h-4 w-4 text-coral" />}
          {site.status}
        </span>
      </td>
    </tr>
  );
}

function TaskItem({ task }: { task: DemoTask }) {
  return (
    <article className="hover-lift rounded-ui border border-ink/10 bg-white/40 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`status-pill ${priorityTone[task.priority]}`}>{task.priority}</span>
            <span className="status-pill bg-paper text-moss">{task.platform}</span>
            <span className="status-pill bg-paper text-steel">{task.status}</span>
          </div>
          <h4 className="mt-3 text-xl font-black">{task.title}</h4>
          <p className="mt-2 text-sm leading-6 text-steel">{task.description}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-black text-teal">{task.due}</p>
      </div>
    </article>
  );
}

function ReadinessItem({ good, label }: { good: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {good ? <ShieldCheck className="h-5 w-5 text-teal" /> : <AlertTriangle className="h-5 w-5 text-coral" />}
      <span className="font-black">{label}</span>
    </div>
  );
}
