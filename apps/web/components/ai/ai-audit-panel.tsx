import { ArrowUpRight, Bot, CheckCircle2, ClipboardList, Gauge, WandSparkles } from "lucide-react";
import { runAiAuditAction } from "../../app/actions";
import { getDashboardData, getSitesForForms } from "../../lib/dashboard-data";
import { DemoFlow } from "../app/demo-flow";
import { AppPageHero, AppStatCard, MetricStrip } from "../app/page-chrome";
import { SubmitButton } from "../ui/submit-button";

export async function AiAuditPanel() {
  const [{ auditFindings, tasks }, sites] = await Promise.all([getDashboardData(), getSitesForForms()]);
  const confidenceAverage = auditFindings.length
    ? Math.round(auditFindings.reduce((sum, finding) => sum + finding.confidence, 0) / auditFindings.length)
    : 0;

  return (
    <main className="page-enter">
      <AppPageHero
        accent="citron"
        action={
          <>
            <a className="btn-accent" href="#audit-runner">
              <WandSparkles className="h-4 w-4" />
              Run audit
            </a>
            <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/tasks">
              View tasks
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </>
        }
        description="Select a connected property, generate an audit record, and push practical work into the task queue."
        eyebrow="AI audit"
        image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1800&q=85"
        title="Turn site data into agency-ready tasks."
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-citron">Audit intelligence</p>
            <h2 className="mt-2 text-3xl font-black">{auditFindings.length} summaries live</h2>
          </div>
          <Bot className="h-7 w-7 text-citron" />
        </div>
        <p className="mt-3 text-sm leading-6 text-cloud/68">
          AI turns platform scores, credential state, and site context into work your team can triage.
        </p>
        <div className="mt-5">
          <MetricStrip
            items={[
              { label: "Sites", value: sites.length.toString(), accent: "teal" },
              { label: "Tasks", value: tasks.length.toString(), accent: "citron" },
              { label: "Confidence", value: `${confidenceAverage}%`, accent: "coral" }
            ]}
          />
        </div>
      </AppPageHero>

      <DemoFlow
        active="ai-audit"
        description="Select a site, generate the audit, and OmniSite will move you to the task board."
        nextHref="#audit-runner"
        nextLabel="Choose site"
      />

      <section className="motion-list mt-6 grid gap-4 md:grid-cols-3">
        <AppStatCard icon={<Gauge className="h-5 w-5" />} label="Audit summaries" note="Latest recommendations" value={auditFindings.length.toString()} />
        <AppStatCard accent="citron" icon={<ClipboardList className="h-5 w-5" />} label="Task queue" note="Generated work" value={tasks.length.toString()} />
        <AppStatCard accent="coral" icon={<Bot className="h-5 w-5" />} label="Average confidence" note="Recommendation strength" value={`${confidenceAverage}%`} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[420px_1fr]" id="audit-runner">
        <section className="scan-panel motion-card rounded-ui bg-graphite p-5 text-cloud shadow-2xl shadow-graphite/15">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-citron">Audit runner</p>
              <h2 className="mt-2 text-3xl font-black">Generate next actions</h2>
            </div>
            <Bot className="h-7 w-7 text-citron" />
          </div>
          <p className="mt-4 text-sm leading-6 text-cloud/70">
            This local version creates structured audit summaries and task records from the site scores, platform, and credential state.
          </p>

          {sites.length ? (
            <form action={runAiAuditAction} className="mt-5 rounded-ui border border-cloud/10 bg-cloud/6 p-4 backdrop-blur-xl">
              <label className="grid gap-2 text-sm font-black">
                Connected site
                <select className="field" name="siteId" required>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.siteName} - {site.platform}
                    </option>
                  ))}
                </select>
              </label>
              <SubmitButton className="btn-accent mt-4 w-full" loadingText="Generating audit...">
                <WandSparkles className="h-4 w-4" />
                Generate audit tasks
              </SubmitButton>
            </form>
          ) : (
            <div className="mt-5 rounded-ui border border-cloud/10 bg-cloud/6 p-4">
              <p className="font-black text-citron">No connected sites yet.</p>
              <a className="btn-accent mt-4 w-full" href="/connected-sites">
                Add a site first
              </a>
            </div>
          )}

          <div className="mt-5 grid gap-3 border-t border-cloud/10 pt-5 text-sm">
            <ChecklistItem label="Creates a new audit row" />
            <ChecklistItem label="Generates platform-specific tasks" />
            <ChecklistItem label="Refreshes dashboard and task queue" />
          </div>
        </section>

        <section className="surface motion-card overflow-hidden">
          <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-teal">Latest intelligence</p>
              <h2 className="mt-1 text-3xl font-black">Audit summaries</h2>
            </div>
            <span className="status-pill bg-paper text-moss">{tasks.length} tasks in queue</span>
          </div>
          <div className="motion-list grid gap-3 border-t border-ink/10 p-5">
            {auditFindings.length ? (
              auditFindings.map((finding) => (
                <article className="hover-lift rounded-ui border border-ink/10 bg-white/45 p-4" key={`${finding.area}-${finding.title}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="status-pill bg-coral/10 text-coral">{finding.area}</span>
                    <span className="text-xs font-black uppercase text-moss">{finding.confidence}% confidence</span>
                  </div>
                  <h3 className="mt-3 text-xl font-black">{finding.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-steel">{finding.recommendation}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-ui bg-paper">
                    <div className="motion-bar h-full rounded-ui bg-teal" style={{ width: `${finding.confidence}%` }} />
                  </div>
                </article>
              ))
            ) : (
              <div className="grid min-h-64 place-items-center text-center">
                <div>
                  <p className="text-sm font-black uppercase text-teal">No audits yet</p>
                  <h3 className="mt-2 text-2xl font-black">Run an audit to create the first recommendation.</h3>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-cloud/80">
      <CheckCircle2 className="h-4 w-4 text-citron" />
      <span className="font-bold">{label}</span>
    </div>
  );
}
