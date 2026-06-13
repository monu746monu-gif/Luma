"use client";

import { useState } from "react";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardList,
  FileText,
  GitBranch,
  Layers3,
  Mail,
  MessageSquareText,
  PenLine,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

type WorkflowTask = {
  title: string;
  status: "Scheduled" | "Waiting";
  icon: React.ElementType;
};

const heroAccentFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Workflow", href: "#workflow" },
  { label: "Trace", href: "#trace" },
  { label: "Demo", href: "#demo" },
];

const heroWorkflow = [
  { label: "Workflow intake created", icon: BrainCircuit, tone: "bg-amber-100 text-amber-800" },
  { label: "AI Task: Write cold emails", icon: Mail, tone: "bg-orange-100 text-orange-800" },
  { label: "Human Task: Approve positioning", icon: UserCheck, tone: "bg-stone-100 text-stone-800" },
  { label: "AI Task: Create X + LinkedIn posts", icon: PenLine, tone: "bg-yellow-100 text-yellow-800" },
  { label: "Trace: Memory updated", icon: GitBranch, tone: "bg-emerald-100 text-emerald-800" },
];

const problemCards = [
  {
    title: "Scattered marketing work",
    copy: "Product notes, prompts, channel ideas, and drafts end up spread across too many tools.",
    icon: Layers3,
  },
  {
    title: "Repeating the same marketing tasks",
    copy: "Every campaign asks for audience research, email drafts, social posts, and planning again.",
    icon: ClipboardList,
  },
  {
    title: "No memory across campaigns",
    copy: "The next workflow forgets what worked, what changed, and what a human already approved.",
    icon: BrainCircuit,
  },
];

const howItWorks = [
  {
    title: "Add your product",
    copy: "Connect Slack so Luma can learn from team context, or explain the product manually.",
    icon: FileText,
  },
  {
    title: "Luma creates product memory",
    copy: "Luma turns Slack/manual context into positioning, audience notes, and reusable product memory.",
    icon: BrainCircuit,
  },
  {
    title: "Luma builds the strategy",
    copy: "It recommends platforms, writes the plan, and splits work between AI and humans.",
    icon: GitBranch,
  },
  {
    title: "AI executes, humans approve",
    copy: "Drafts, posts, calendars, and outreach move forward with clear approval gates.",
    icon: ShieldCheck,
  },
];

const aiTasks: WorkflowTask[] = [
  { title: "Research target channels", status: "Scheduled", icon: Search },
  { title: "Write 10 cold email drafts", status: "Scheduled", icon: Mail },
  { title: "Create X launch thread", status: "Scheduled", icon: MessageSquareText },
  { title: "Create LinkedIn announcement", status: "Scheduled", icon: PenLine },
  { title: "Draft Reddit community post", status: "Scheduled", icon: FileText },
  { title: "Build 7-day launch calendar", status: "Scheduled", icon: CalendarDays },
];

const humanTasks: WorkflowTask[] = [
  { title: "Approve target audience", status: "Waiting", icon: UserCheck },
  { title: "Approve positioning", status: "Waiting", icon: BadgeCheck },
  { title: "Review emails before sending", status: "Waiting", icon: Mail },
  { title: "Approve public social posts", status: "Waiting", icon: CheckCircle2 },
  { title: "Final launch review", status: "Waiting", icon: ShieldCheck },
];

const traceItems = [
  "Luma read product brain",
  "Marketing workflow generated",
  "AI created outreach tasks",
  "Human approval required for positioning",
  "Memory updated after approval",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Pill({
  children,
  tone = "warm",
}: {
  children: React.ReactNode;
  tone?: "warm" | "ai" | "human";
}) {
  const tones = {
    warm: "border-amber-200 bg-amber-50 text-amber-900",
    ai: "border-orange-200 bg-orange-50 text-orange-900",
    human: "border-stone-200 bg-stone-50 text-stone-800",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-1 left-0 z-0 h-3 w-full rounded-full bg-yellow-300/80" />
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className="mx-auto max-w-3xl text-center"
    >
      <Pill>{eyebrow}</Pill>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {copy ? <p className="mt-5 text-lg leading-8 text-umber/80">{copy}</p> : null}
    </motion.div>
  );
}

function WorkflowPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      whileHover={{ y: -8, scale: 1.015 }}
      className="relative mx-auto w-full max-w-xl rounded-lg border border-white/70 bg-white/75 p-4 shadow-premium backdrop-blur md:p-5"
    >
      <div className="absolute -right-4 -top-5 hidden rounded-full bg-amberSoft px-4 py-2 text-xs font-bold text-white shadow-card sm:block">
        Live workflow
      </div>
      <div className="rounded-lg border border-amber-100 bg-cream p-5">
        <div className="flex items-center justify-between border-b border-amber-100 pb-4">
          <div>
            <p className="text-sm font-semibold text-umber">Launch graph</p>
            <p className="text-xs text-umber/60">Human + AI distribution system</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-amber-100">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {heroWorkflow.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 8, scale: 1.02 }}
                transition={{ delay: 0.25 + index * 0.1, duration: 0.45 }}
                className="relative flex items-center gap-3 rounded-lg border border-amber-100 bg-white px-4 py-3 shadow-sm"
              >
                {index < heroWorkflow.length - 1 ? (
                  <span className="absolute left-7 top-[3.25rem] h-5 w-px bg-amber-200" />
                ) : null}
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-ink">{item.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function WorkflowColumn({
  title,
  label,
  tasks,
  tone,
}: {
  title: string;
  label: "AI Task" | "Human Approval";
  tasks: WorkflowTask[];
  tone: "ai" | "human";
}) {
  const isAi = tone === "ai";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="rounded-lg border border-white/80 bg-white/80 p-4 shadow-card backdrop-blur sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <Pill tone={tone}>{label}</Pill>
      </div>
      <div className="space-y-3">
        {tasks.map((task, index) => {
          const Icon = task.icon;
          return (
            <motion.div
              key={task.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ x: 6, scale: 1.015 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className="group flex items-center gap-3 rounded-lg border border-amber-100 bg-cream p-4 transition hover:border-amber-300 hover:bg-white hover:shadow-card"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110 group-hover:rotate-3 ${
                  isAi ? "bg-orange-100 text-orange-800" : "bg-stone-100 text-stone-800"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{task.title}</p>
                <p className="mt-1 text-xs text-umber/60">{task.status}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  task.status === "Scheduled"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-white text-stone-700 ring-1 ring-stone-200"
                }`}
              >
                {task.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [workflowVisible, setWorkflowVisible] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <nav className="sticky top-0 z-50 border-b border-amber-100/70 bg-ivory/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2 text-xl font-bold tracking-tight text-ink">
            <span className="relative h-9 w-9 overflow-hidden rounded-xl bg-amber-100 shadow-sm">
              <Image src="/logo.jpeg" alt="Luma logo" fill sizes="36px" className="object-cover object-center" priority />
            </span>
            Luma
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-umber/75 transition hover:text-ink">
                {item.label}
              </a>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-amber-50 shadow-card transition hover:-translate-y-0.5 hover:bg-[#38271d]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <section id="top" className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.65 }}>
          <Pill>Marketing workflow automation</Pill>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Marketing workflows, generated from one product prompt.
          </h1>
          <p className={`${heroAccentFont.className} mt-6 max-w-2xl text-lg leading-8 text-black sm:text-xl`}>
            Luma learns your product using Slack, and builds the{" "}
            <span className="bg-[#fde68a] px-1.5 py-0.5 text-black">
              full marketing workflow
            </span>
            , assigns approval work to humans, and lets AI handle the rest — from creating posts and emails to finding customers, tracking growth, and improving your launch strategy.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-amberSoft">
            Get your first 100 users with
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-[#111827]">
              Luma
              <span className="relative h-4 w-4 overflow-hidden rounded-sm">
                <Image
                  src="/logo.jpeg"
                  alt=""
                  fill
                  sizes="16px"
                  className="object-cover object-center"
                />
              </span>
            </span>
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amberSoft px-6 py-3.5 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-[#d99125]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-white/70 px-6 py-3.5 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              View Workflow
              <GitBranch className="h-4 w-4" />
            </a>
            <Link
              href="/growth"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-white/70 px-6 py-3.5 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              Growth graphs
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <WorkflowPreview />
      </section>

      <section id="product" className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Product problem"
            title={
              <>
                Building is easy. <Highlight>Distribution</Highlight> is the hard part.
              </>
            }
            copy="Most founders can ship fast, but then get stuck on who to reach, where to post, what to say, and how to keep the launch moving. Luma gives them one AI workspace for distribution instead of scattered tools and random prompts."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {problemCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{ y: -10, scale: 1.025 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-lg border border-white/80 bg-white/75 p-6 shadow-card backdrop-blur transition hover:border-amber-200 hover:bg-white hover:shadow-premium"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-300 via-amberSoft to-orange-400 opacity-0 transition group-hover:opacity-100" />
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-900 transition group-hover:scale-110 group-hover:rotate-3 group-hover:bg-yellow-200">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-ink">{card.title}</h3>
                  <p className="mt-3 leading-7 text-umber/75">{card.copy}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                From product <Highlight>idea to launch</Highlight> system.
              </>
            }
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{ y: -10, scale: 1.03 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-lg border border-amber-100 bg-cream p-6 shadow-card transition hover:border-yellow-300 hover:bg-white hover:shadow-premium"
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-yellow-200/50 opacity-0 blur-2xl transition group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-amber-800 shadow-sm transition group-hover:scale-110 group-hover:rotate-3 group-hover:bg-yellow-100">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-sm font-bold text-amber-800 transition group-hover:text-orange-700">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-umber/75">{step.copy}</p>
                  {index < howItWorks.length - 1 ? (
                    <ChevronRight className="absolute -right-4 top-1/2 hidden h-7 w-7 -translate-y-1/2 text-amber-300 lg:block" />
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/70 bg-white/55 p-5 shadow-premium backdrop-blur sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <Pill>Workflow engine</Pill>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
                Luma decides what AI can do and what needs approval.
              </h2>
              <p className="mt-5 text-lg leading-8 text-umber/78">
                Each workflow starts from product memory, then turns distribution into assigned work:
                research, writing, launch calendars, approval gates, and traceable updates.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <WorkflowColumn title="Agent execution" label="AI Task" tasks={aiTasks.slice(0, 3)} tone="ai" />
              <WorkflowColumn title="Founder gates" label="Human Approval" tasks={humanTasks.slice(0, 3)} tone="human" />
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Demo"
            title="Generate a marketing strategy and workflow."
            copy="Give Luma one product prompt. It plans the launch, creates AI tasks, asks humans for approval, and tracks every step."
          />

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="mt-12 overflow-hidden rounded-lg border border-white/80 bg-white/75 shadow-premium backdrop-blur"
          >
            <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-5 sm:p-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <Pill>One prompt demo</Pill>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    “Launch my product and get my first 100 users.”
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-umber/75">
                    Luma reads the product context, builds the distribution workflow,
                    creates AI execution tasks, and pauses only when a human approval is needed.
                  </p>
                </div>

                <button
                  onClick={() => setWorkflowVisible(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-amber-50 shadow-card transition hover:-translate-y-0.5 hover:bg-[#38271d] sm:w-auto"
                >
                  Generate Flow
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-8">
              {[
                {
                  title: "Product memory",
                  copy: "Slack or manual context becomes reusable launch memory.",
                  icon: BrainCircuit,
                },
                {
                  title: "AI execution",
                  copy: "Luma writes posts, drafts emails, researches channels, and builds the calendar.",
                  icon: Bot,
                },
                {
                  title: "Human approvals",
                  copy: "Founders approve positioning, emails, and public posts before anything goes out.",
                  icon: UserCheck,
                },
              ].map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.025 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group rounded-lg border border-amber-100 bg-cream p-5 transition hover:border-yellow-300 hover:bg-white hover:shadow-card"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-amber-800 shadow-sm transition group-hover:scale-110 group-hover:rotate-3 group-hover:bg-yellow-100">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h4 className="mt-5 text-base font-semibold text-ink">{card.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-umber/75">{card.copy}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <AnimatePresence>
            {workflowVisible ? (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.5 }}
                className="mt-8 grid gap-5 lg:grid-cols-2"
              >
                <WorkflowColumn title="AI can do" label="AI Task" tasks={aiTasks} tone="ai" />
                <WorkflowColumn title="Human approval needed" label="Human Approval" tasks={humanTasks} tone="human" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      <section id="trace" className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Pill>Trace</Pill>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-5xl">Trace every move</h2>
            <p className="mt-5 text-lg leading-8 text-umber/78">
              Luma keeps a readable record of what it used, what it created, what needed human judgment,
              and how product memory changed after approval.
            </p>
          </div>
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="rounded-lg border border-white/80 bg-white/75 p-5 shadow-premium backdrop-blur sm:p-7"
          >
            <div className="space-y-4">
              {traceItems.map((item, index) => (
                <motion.div
                  key={item}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{ x: 8, scale: 1.015 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="group relative flex gap-4 rounded-lg border border-amber-100 bg-cream p-4 transition hover:border-yellow-300 hover:bg-white hover:shadow-card"
                >
                  {index < traceItems.length - 1 ? (
                    <span className="absolute left-[1.85rem] top-12 h-7 w-px bg-amber-200" />
                  ) : null}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-amber-800 shadow-sm transition group-hover:scale-110 group-hover:bg-yellow-100">
                    <CircleDot className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item}</p>
                    <p className="mt-1 text-xs text-umber/60">Step {index + 1} recorded in launch memory</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-5 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-lg border border-amber-100 bg-ink px-6 py-14 text-center shadow-premium sm:px-10">
          <Pill>Start here</Pill>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-amber-50 sm:text-5xl">
            Turn your product into a tracked marketing workflow.
          </h2>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-amberSoft px-6 py-3.5 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-[#d99125]"
          >
            Start with Luma
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}