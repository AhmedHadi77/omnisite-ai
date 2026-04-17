import { ArrowUpRight, ClipboardCheck, Clock3, ListChecks, Sparkles, TimerReset } from "lucide-react";
import { DemoFlow } from "../../../components/app/demo-flow";
import { AppPageHero, AppStatCard, MetricStrip } from "../../../components/app/page-chrome";
import { getDashboardData } from "../../../lib/dashboard-data";
import type { DemoTask } from "../../../lib/demo-data";

const priorityTone: Record<DemoTask["priority"], string> = {
  High: "bg-coral text-white",
  Medium: "bg-teal text-white",
  Low: "bg-moss text-white"
};

export default async function TasksPage({
  searchParams
}: {
  searchParams?: Promise<{ audit?: string }>;
}) {
  const params = await searchParams;
  const { tasks } = await getDashboardData();
  const highPriority = tasks.filter((task) => task.priority === "High").length;
  const inReview = tasks.filter((task) => task.status === "Review").length;
  const platforms = new Set(tasks.map((task) => task.platform)).size;
  const todayTasks = tasks.filter((task) => task.due === "Today").length;

  return (
    <main className="page-enter">
      <AppPageHero
        accent="coral"
        action={
          <>
            <a className="btn-accent" href="/ai-audit">
              <Sparkles className="h-4 w-4" />
              Generate more
            </a>
            <a className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/dashboard">
              Back to dashboard
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </>
        }
        description="Audit output becomes a practical production board for Webflow, WordPress, and Shopify work."
        eyebrow="Agency queue"
        image="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1800&q=85"
        title="AI-generated tasks, ready for specialist handoff."
      >
        <p className="text-xs font-black uppercase text-citron">Production pulse</p>
        <h2 className="mt-2 text-3xl font-black">{highPriority} high priority</h2>
        <p className="mt-3 text-sm leading-6 text-cloud/68">
          Sort the work by priority, impact, platform, and deadline before it reaches delivery.
        </p>
        <div className="mt-5">
          <MetricStrip
            items={[
              { label: "Tasks", value: tasks.length.toString(), accent: "teal" },
              { label: "Today", value: todayTasks.toString(), accent: "coral" },
              { label: "Platforms", value: platforms.toString(), accent: "citron" }
            ]}
          />
        </div>
      </AppPageHero>

      {params?.audit === "created" ? (
        <div className="motion-card mt-5 flex flex-col gap-3 rounded-ui border border-teal/20 bg-teal/10 px-4 py-3 text-sm font-black text-teal md:flex-row md:items-center md:justify-between">
          <span>AI audit completed and new tasks were added to the queue.</span>
          <a className="inline-flex items-center gap-2 text-ink hover:text-moss" href="/client-requests">
            Review client requests
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      ) : null}

      <DemoFlow
        active="tasks"
        description="Generated tasks prove the audit is not just text; it creates real agency work."
        nextHref="/client-requests"
        nextLabel="Review requests"
      />

      <section className="motion-list mt-6 grid gap-4 md:grid-cols-3">
        <AppStatCard icon={<ListChecks className="h-5 w-5" />} label="Total tasks" note="Active production work" value={tasks.length.toString()} />
        <AppStatCard accent="coral" icon={<Clock3 className="h-5 w-5" />} label="High priority" note="Needs fast review" value={highPriority.toString()} />
        <AppStatCard accent="citron" icon={<ClipboardCheck className="h-5 w-5" />} label="In review" note={`${platforms} platforms covered`} value={inReview.toString()} />
      </section>

      <section className="surface motion-card mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-moss">Production board</p>
            <h2 className="mt-1 text-3xl font-black">Ready for specialist handoff</h2>
          </div>
          <span className="status-pill bg-paper text-moss">
            <TimerReset className="h-3 w-3" />
            {todayTasks} due today
          </span>
        </div>

        {tasks.length ? (
          <div className="motion-list grid gap-3 border-t border-ink/10 p-5">
            {tasks.map((task) => (
              <TaskRow key={`${task.platform}-${task.title}`} task={task} />
            ))}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center border-t border-ink/10 p-8 text-center">
            <div>
              <p className="text-sm font-black uppercase text-teal">No tasks yet</p>
              <h2 className="mt-2 text-3xl font-black">Run an AI audit to generate your first task queue.</h2>
              <a className="btn-primary mt-5" href="/ai-audit">
                Run AI audit
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function TaskRow({ task }: { task: DemoTask }) {
  return (
    <article className="hover-lift rounded-ui border border-ink/10 bg-white/45 p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_170px_120px] lg:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`status-pill ${priorityTone[task.priority]}`}>{task.priority}</span>
            <span className="status-pill bg-paper text-moss">{task.platform}</span>
            <span className="status-pill bg-paper text-steel">{task.status}</span>
          </div>
          <h3 className="mt-3 text-xl font-black">{task.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-steel">{task.description}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase text-steel">Impact</p>
          <p className="mt-1 font-black text-moss">{task.impact}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-ui bg-paper">
            <div className="motion-bar h-full rounded-ui bg-teal" style={{ width: task.priority === "High" ? "92%" : "68%" }} />
          </div>
        </div>
        <div>
          <p className="text-xs font-black uppercase text-steel">Due</p>
          <p className="mt-1 font-black text-teal">{task.due}</p>
        </div>
      </div>
    </article>
  );
}
