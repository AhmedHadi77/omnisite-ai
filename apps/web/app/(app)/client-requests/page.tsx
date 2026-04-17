import { ArrowUpRight, CheckCircle2, Clock3, MessageSquareText, Send, Sparkles } from "lucide-react";
import { DemoFlow } from "../../../components/app/demo-flow";
import { AppPageHero, AppStatCard, MetricStrip } from "../../../components/app/page-chrome";
import { getDashboardData } from "../../../lib/dashboard-data";

export default async function ClientRequestsPage() {
  const { clientRequests } = await getDashboardData();
  const approvals = clientRequests.filter((request) => request.status.includes("approval")).length;
  const drafts = clientRequests.filter((request) => request.status.includes("draft")).length;
  const inProduction = clientRequests.filter((request) => request.status.includes("production")).length;

  return (
    <main className="page-enter">
      <AppPageHero
        accent="teal"
        action={
          <>
            <a className="btn-accent" href="/tasks">
              Open task board
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/ai-audit">
              Generate work
              <Sparkles className="h-4 w-4" />
            </a>
            <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/case-study">
              Case study
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </>
        }
        description="Track what clients asked for, what AI drafted, and what the agency needs to approve next."
        eyebrow="Client portal"
        image="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85"
        title="Requests, approvals, and client-facing work in one queue."
      >
        <p className="text-xs font-black uppercase text-citron">Approval flow</p>
        <h2 className="mt-2 text-3xl font-black">{approvals} waiting on approval</h2>
        <p className="mt-3 text-sm leading-6 text-cloud/68">
          Keep request intake, AI drafts, and task conversion visible before handoff.
        </p>
        <div className="mt-5">
          <MetricStrip
            items={[
              { label: "Requests", value: clientRequests.length.toString(), accent: "teal" },
              { label: "Drafts", value: drafts.toString(), accent: "citron" },
              { label: "Active", value: inProduction.toString(), accent: "coral" }
            ]}
          />
        </div>
      </AppPageHero>

      <DemoFlow
        active="client-review"
        description="This is the final screen for the demo recording: the work reaches a client-facing approval queue."
        nextHref="/case-study"
        nextLabel="Open case study"
      />

      <section className="motion-list mt-6 grid gap-4 md:grid-cols-3">
        <AppStatCard icon={<MessageSquareText className="h-5 w-5" />} label="Requests" note="Client items logged" value={clientRequests.length.toString()} />
        <AppStatCard accent="citron" icon={<CheckCircle2 className="h-5 w-5" />} label="Approvals" note="Awaiting signoff" value={approvals.toString()} />
        <AppStatCard accent="coral" icon={<Clock3 className="h-5 w-5" />} label="AI drafts" note="Ready to refine" value={drafts.toString()} />
      </section>

      <section className="surface motion-card mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-teal">Request queue</p>
            <h2 className="mt-1 text-3xl font-black">Client-facing work</h2>
          </div>
          <span className="status-pill bg-paper text-moss">Workspace scoped</span>
        </div>

        {clientRequests.length ? (
          <div className="motion-list grid gap-3 border-t border-ink/10 p-5 lg:grid-cols-3">
            {clientRequests.map((request) => (
              <article className="hover-lift rounded-ui border border-ink/10 bg-white/45 p-5" key={request.request}>
                <div className="flex items-center justify-between gap-3">
                  <span className="status-pill bg-teal/10 text-teal">{request.status}</span>
                  <span className="text-xs font-black uppercase text-steel">{request.age}</span>
                </div>
                <h3 className="mt-4 text-2xl font-black">{request.request}</h3>
                <p className="mt-3 text-sm leading-6 text-steel">{request.client}</p>
                <div className="mt-5 h-2 overflow-hidden rounded-ui bg-paper">
                  <div className="motion-bar h-full rounded-ui bg-citron" style={{ width: request.status.includes("approval") ? "72%" : "88%" }} />
                </div>
                <a className="mt-5 inline-flex items-center gap-2 text-sm font-black text-moss hover:text-teal" href="/tasks">
                  Convert to task
                  <Send className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center border-t border-ink/10 p-8 text-center">
            <div>
              <p className="text-sm font-black uppercase text-teal">No requests yet</p>
              <h2 className="mt-2 text-3xl font-black">Client requests will appear here once submitted.</h2>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
