"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Bot, ClipboardList, Globe2, Play, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";

const platforms = [
  { name: "Webflow", detail: "Pages, CMS, forms", color: "bg-teal" },
  { name: "WordPress", detail: "Posts, links, media", color: "bg-coral" },
  { name: "Shopify", detail: "Products, orders, SEO", color: "bg-citron" }
];

const flow = [
  "Sign in",
  "Add client site",
  "Test API access",
  "Run AI audit",
  "Generate tasks"
];

const modules = [
  { title: "Connect sites", text: "Add platform credentials and keep every client property in one workspace.", icon: Globe2 },
  { title: "Run AI audits", text: "Create SEO, UX, speed, and conversion recommendations from site data.", icon: Bot },
  { title: "Ship the work", text: "Turn recommendations into tasks, approvals, and clear agency handoff.", icon: ClipboardList }
];

const workspaceHref = "/connected-sites?flow=started";

export function HomePageClient() {
  return (
    <main className="min-h-screen bg-[#f3f7f2] text-ink">
      <section className="relative overflow-hidden bg-graphite text-cloud">
        <img
          alt="Professional team working with analytics dashboards"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.54]"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2200&q=90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/86 to-graphite/34" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f3f7f2] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col px-6 py-7 md:px-10">
          <motion.nav
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4"
            initial={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6 }}
          >
            <a className="text-sm font-black uppercase tracking-normal" href="/">OmniSite AI</a>
            <div className="hidden items-center gap-7 text-sm font-black text-cloud/72 md:flex">
              <a className="hover:text-citron" href="/features">Features</a>
              <a className="hover:text-citron" href="/case-study">Case Study</a>
              <a className="hover:text-citron" href="/demo">Demo</a>
            </div>
            <MotionLink className="btn-accent" href={workspaceHref}>Open app</MotionLink>
          </motion.nav>

          <div className="grid flex-1 items-center gap-10 py-14 xl:grid-cols-[1.04fr_0.96fr]">
            <div>
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex rounded-ui bg-citron px-3 py-2 text-sm font-black uppercase text-ink"
                initial={{ opacity: 0, y: 18 }}
                transition={{ delay: 0.1, duration: 0.55 }}
              >
                AI website operations for agencies
              </motion.p>
              <motion.h1
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 max-w-5xl font-[var(--font-display)] text-5xl leading-none md:text-7xl"
                initial={{ opacity: 0, y: 34 }}
                transition={{ delay: 0.2, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              >
                Manage every client website from one animated AI command center.
              </motion.h1>
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 max-w-2xl text-xl leading-9 text-cloud/78"
                initial={{ opacity: 0, y: 24 }}
                transition={{ delay: 0.34, duration: 0.6 }}
              >
                Connect Webflow, WordPress, and Shopify sites. Test access. Run AI audits. Generate tasks your agency can actually deliver.
              </motion.p>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 18 }}
                transition={{ delay: 0.46, duration: 0.55 }}
              >
                <MotionLink className="btn-accent min-w-44" href={workspaceHref}>
                  Launch workspace
                  <ArrowUpRight className="h-4 w-4" />
                </MotionLink>
                <MotionLink className="btn-secondary border-cloud/20 bg-cloud/12 text-cloud hover:bg-cloud/20" href="/case-study">
                  <Play className="h-4 w-4" />
                  View case study
                </MotionLink>
              </motion.div>
            </div>

            <motion.div
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              className="relative"
              initial={{ opacity: 0, x: 48, rotate: 1.5 }}
              transition={{ delay: 0.32, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                className="rounded-ui border border-cloud/15 bg-cloud/14 p-4 shadow-2xl shadow-ink/35 backdrop-blur-xl"
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  alt="Analytics dashboard on laptop"
                  className="h-56 w-full rounded-ui object-cover"
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=90"
                />
                <div className="mt-4 grid gap-3">
                  {platforms.map((platform, index) => (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-ui bg-cloud/10 p-4"
                      initial={{ opacity: 0, x: 28 }}
                      key={platform.name}
                      transition={{ delay: 0.6 + index * 0.12, duration: 0.45 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black">{platform.name}</p>
                          <p className="text-sm text-cloud/65">{platform.detail}</p>
                        </div>
                        <span className="rounded-ui bg-citron px-2 py-1 text-xs font-black text-ink">Connected</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-ui bg-cloud/12">
                        <motion.div
                          animate={{ scaleX: 1 }}
                          className={`h-full origin-left rounded-ui ${platform.color}`}
                          initial={{ scaleX: 0 }}
                          transition={{ delay: 0.82 + index * 0.16, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -1, 0] }}
                className="absolute -bottom-7 -left-5 hidden rounded-ui bg-citron p-4 text-ink shadow-2xl md:block"
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-6 w-6" />
                <p className="mt-2 text-sm font-black uppercase">AI tasks ready</p>
                <p className="text-3xl font-black">27</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-12 md:grid-cols-5 md:px-10">
        {flow.map((item, index) => (
          <motion.article
            className="surface p-5"
            initial={{ opacity: 0, y: 24 }}
            key={item}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            viewport={{ once: true, margin: "-80px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-black uppercase text-teal">0{index + 1}</p>
            <h2 className="mt-3 text-xl font-black">{item}</h2>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-14 md:grid-cols-3 md:px-10">
        {modules.map((module, index) => (
          <motion.article
            className="surface p-6"
            initial={{ opacity: 0, y: 28 }}
            key={module.title}
            transition={{ delay: index * 0.12, duration: 0.55 }}
            viewport={{ once: true, margin: "-80px" }}
            whileHover={{ y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <module.icon className="h-9 w-9 text-teal" />
            <h2 className="mt-5 text-3xl font-black">{module.title}</h2>
            <p className="mt-3 leading-7 text-steel">{module.text}</p>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-10">
        <div className="rounded-ui bg-graphite p-6 text-cloud shadow-2xl shadow-graphite/20 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black uppercase text-citron">Clear demo story</p>
              <h2 className="mt-2 text-4xl font-black">Sign in, add a site, test APIs, run AI audit, generate tasks.</h2>
            </div>
            <MotionLink className="btn-accent" href={workspaceHref}>
              Try the flow
              <Zap className="h-4 w-4" />
            </MotionLink>
          </div>
        </div>
      </section>
    </main>
  );
}

function MotionLink({ className, href, children }: { className: string; href: string; children: ReactNode }) {
  return (
    <motion.a className={className} href={href} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      {children}
    </motion.a>
  );
}
