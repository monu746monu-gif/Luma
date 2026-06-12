"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  Mail,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { GeneratedWorkflow } from "@/components/dashboard/types";

type WorkStatus = "ready" | "running" | "complete";

type ExecutionTask = {
  id: string;
  title: string;
  tool: string;
  status: WorkStatus;
};

const nicheRules = [
  { keywords: ["ai", "agent", "automation", "workflow"], niche: "AI workflow automation", audience: "operators, founders, and lean teams" },
  { keywords: ["note", "meeting", "docs", "knowledge"], niche: "Productivity and knowledge management", audience: "knowledge workers and product teams" },
  { keywords: ["crm", "sales", "lead", "outreach"], niche: "Sales and customer acquisition", audience: "sales teams and founders" },
  { keywords: ["finance", "invoice", "payment", "billing"], niche: "Fintech and business operations", audience: "finance teams and small businesses" },
  { keywords: ["design", "creative", "video", "image"], niche: "Creative tools", audience: "creators, marketers, and designers" },
  { keywords: ["learn", "course", "student", "education"], niche: "Education technology", audience: "students, teachers, and training teams" },
];

function fallbackWorkflow(): GeneratedWorkflow {
  return {
    product_brain: {
      summary: "Add a product link so Luma can analyze the product and start the execution plan.",
      positioning: "Execution dashboard waiting for product analysis.",
      best_channels: ["X", "LinkedIn", "Reddit", "Email"],
      core_audience: ["Early users", "Relevant communities", "Warm prospects"],
    },
    workflow: [],
    platform_content: [],
    human_tasks: [],
    ai_tasks: [],
    trace: [],
  };
}

function safeParseWorkflow(value: string | null): GeneratedWorkflow {
  if (!value) return fallbackWorkflow();

  try {
    return JSON.parse(value) as GeneratedWorkflow;
  } catch {
    return fallbackWorkflow();
  }
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function analyzeProduct(productLink: string, prompt: string, workflow: GeneratedWorkflow) {
  const normalizedUrl = normalizeUrl(productLink);
  const host = normalizedUrl ? new URL(normalizedUrl).hostname.replace(/^www\./, "") : "product site";
  const sourceText = `${host} ${prompt} ${workflow.product_brain.summary} ${workflow.product_brain.positioning}`.toLowerCase();
  const match = nicheRules.find((rule) => rule.keywords.some((keyword) => sourceText.includes(keyword)));
  const niche = match?.niche ?? "SaaS launch and growth";
  const audience = match?.audience ?? workflow.product_brain.core_audience?.[0] ?? "founders, builders, and early customers";

  return {
    host,
    niche,
    audience,
    plan: [
      `Position the product for ${audience}.`,
      `Use ${workflow.product_brain.best_channels?.slice(0, 3).join(", ") || "X, LinkedIn, and Email"} as the first execution channels.`,
      "Generate short public posts, review-sensitive copy, and send approved email outreach.",
      "Track every AI action as drafted, reviewed, approved, sent, or pending.",
    ],
  };
}

function buildExecutionTasks(workflow: GeneratedWorkflow): ExecutionTask[] {
  const workflowTasks = workflow.workflow
    .filter((step) => step.owner !== "human")
    .slice(0, 8)
    .map((step, index) => ({
      id: `workflow-${step.id || index}`,
      title: step.title,
      tool: step.app || step.agent || "Luma",
      status: "ready" as WorkStatus,
    }));

  const aiTasks = workflow.ai_tasks.slice(0, 4).map((task, index) => ({
    id: `ai-${index}`,
    title: task.title,
    tool: task.tool,
    status: "ready" as WorkStatus,
  }));

  return [...workflowTasks, ...aiTasks].slice(0, 10);
}

export default function ExecutePage() {
  const [workflow, setWorkflow] = useState<GeneratedWorkflow>(() => fallbackWorkflow());
  const [prompt, setPrompt] = useState("");
  const [productLink, setProductLink] = useState("");
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeProduct> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tasks, setTasks] = useState<ExecutionTask[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("Quick feedback?");
  const [emailBody, setEmailBody] = useState("Hi,\n\nI am sharing this because it may be useful for your team. Would you be open to taking a quick look and sharing feedback?");
  const [mailStatus, setMailStatus] = useState("");

  useEffect(() => {
    const storedWorkflow = safeParseWorkflow(window.localStorage.getItem("luma_execution_workflow"));
    const storedPrompt = window.localStorage.getItem("luma_execution_prompt") ?? "";

    setWorkflow(storedWorkflow);
    setPrompt(storedPrompt);
    setTasks(buildExecutionTasks(storedWorkflow));
  }, []);

  const completeCount = useMemo(
    () => tasks.filter((task) => task.status === "complete").length,
    [tasks]
  );

  function runAnalysis() {
    const normalizedUrl = normalizeUrl(productLink);

    if (!normalizedUrl) {
      setMailStatus("Add your product link before analysis.");
      window.setTimeout(() => setMailStatus(""), 3000);
      return;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setMailStatus("Add a valid product link.");
      window.setTimeout(() => setMailStatus(""), 3000);
      return;
    }

    setIsAnalyzing(true);
    window.setTimeout(() => {
      setAnalysis(analyzeProduct(normalizedUrl, prompt, workflow));
      setIsAnalyzing(false);
    }, 700);
  }

  function startExecution() {
    if (!analysis) {
      setMailStatus("Analyze the product link first.");
      window.setTimeout(() => setMailStatus(""), 3000);
      return;
    }

    setIsExecuting(true);
    setTasks((current) => current.map((task) => ({ ...task, status: "ready" })));

    tasks.forEach((task, index) => {
      window.setTimeout(() => {
        setTasks((current) =>
          current.map((item) => item.id === task.id ? { ...item, status: "running" } : item)
        );
      }, index * 650);

      window.setTimeout(() => {
        setTasks((current) =>
          current.map((item) => item.id === task.id ? { ...item, status: "complete" } : item)
        );

        if (index === tasks.length - 1) {
          setIsExecuting(false);
        }
      }, index * 650 + 520);
    });
  }

  async function sendEmail() {
    if (!senderEmail || !recipientEmail || !emailSubject || !emailBody) {
      setMailStatus("Add sender email, recipient, subject, and message.");
      return;
    }

    setMailStatus("Sending through Resend...");

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipientEmail,
        subject: emailSubject,
        replyTo: senderEmail,
        body: emailBody,
      }),
    });

    const result = (await response.json()) as { success?: boolean; error?: string };
    setMailStatus(result.success ? "Email sent through Luma Resend." : result.error || "Email failed.");
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#111827]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d8e0ea] pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[#d8e0ea] bg-white shadow-sm">
              <Image src="/logo.jpeg" alt="Luma logo" fill sizes="48px" className="object-cover object-center" priority />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0f766e]">Execution dashboard</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#111827]">Run the AI work from your workflow</h1>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-[#d8e0ea] bg-white px-3.5 py-2 text-sm font-bold text-[#111827] transition hover:bg-[#f8fafc]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[#d8e0ea] bg-white p-5 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">
              <Search className="h-4 w-4" />
              Product analysis
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold">Product link</span>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  value={productLink}
                  onChange={(event) => setProductLink(event.target.value)}
                  placeholder="https://yourproduct.com"
                  className="min-h-12 flex-1 rounded-xl border border-[#d8e0ea] bg-[#f8fafc] px-4 text-sm font-medium outline-none transition placeholder:text-[#94a3b8] focus:border-[#99f6e4] focus:bg-white focus:ring-4 focus:ring-[#ccfbf1]"
                />
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-bold text-white transition hover:bg-[#243041] disabled:opacity-70"
                >
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Analyze
                </button>
              </div>
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e0ea]">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">Niche</p>
                <p className="mt-2 text-sm font-bold">{analysis?.niche ?? "Waiting for link"}</p>
              </div>
              <div className="rounded-xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e0ea]">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">Audience</p>
                <p className="mt-2 text-sm font-bold">{analysis?.audience ?? workflow.product_brain.core_audience?.[0] ?? "Early users"}</p>
              </div>
              <div className="rounded-xl bg-[#f8fafc] p-4 ring-1 ring-[#d8e0ea]">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">Workflow</p>
                <p className="mt-2 text-sm font-bold">{workflow.workflow.length || tasks.length} AI steps</p>
              </div>
            </div>

            {analysis ? (
              <div className="mt-4 rounded-xl border border-[#d8e0ea] bg-[#ecfdf5] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#0f766e]">{analysis.host}</p>
                    <p className="mt-1 text-sm leading-6 text-[#334155]">{workflow.product_brain.positioning}</p>
                  </div>
                  <a href={normalizeUrl(productLink)} target="_blank" rel="noreferrer" className="text-[#0f766e]">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {analysis.plan.map((item) => (
                    <li key={item} className="rounded-lg bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#334155]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-[#d8e0ea] bg-white p-5 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Command center</p>
                <h2 className="mt-2 text-lg font-semibold">AI execution queue</h2>
              </div>
              <span className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-bold text-[#334155] ring-1 ring-[#d8e0ea]">
                {completeCount}/{tasks.length} done
              </span>
            </div>

            <button
              onClick={startExecution}
              disabled={isExecuting || !tasks.length}
              className="mt-4 inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-bold text-white transition hover:bg-[#243041] disabled:opacity-70"
            >
              {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Start AI execution
            </button>

            <div className="mt-4 space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-xl border border-[#d8e0ea] bg-[#f8fafc] p-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    task.status === "complete" ? "bg-[#dcfce7] text-[#16a34a]" : task.status === "running" ? "bg-[#fef3c7] text-[#b45309]" : "bg-white text-[#64748b]"
                  }`}>
                    {task.status === "complete" ? <CheckCircle2 className="h-4 w-4" /> : task.status === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock3 className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{task.title}</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#64748b]">{task.tool}</p>
                  </div>
                  <span className="text-xs font-bold capitalize text-[#64748b]">{task.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-[#d8e0ea] bg-white p-5 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#0f766e]" />
              <h2 className="text-lg font-semibold">Connect mail and send outreach</h2>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button className="rounded-xl border border-[#0f766e] bg-[#ecfdf5] p-4 text-left">
                <ShieldCheck className="h-5 w-5 text-[#0f766e]" />
                <p className="mt-2 text-sm font-bold">Use Luma Resend</p>
                <p className="mt-1 text-xs leading-5 text-[#526172]">Resend is connected. Luma sends from the configured sender and uses the user's email as reply-to.</p>
              </button>
              <button
                onClick={() => setMailStatus("Gmail access needs OAuth credentials before it can send from the user's Gmail account.")}
                className="rounded-xl border border-[#d8e0ea] bg-[#f8fafc] p-4 text-left transition hover:bg-white"
              >
                <Mail className="h-5 w-5 text-[#ea4335]" />
                <p className="mt-2 text-sm font-bold">Ask for Gmail access</p>
                <p className="mt-1 text-xs leading-5 text-[#526172]">Request Gmail permission when Google OAuth is configured.</p>
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <input value={senderEmail} onChange={(event) => setSenderEmail(event.target.value)} placeholder="User email to connect" className="min-h-11 rounded-xl border border-[#d8e0ea] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[#99f6e4] focus:ring-4 focus:ring-[#ccfbf1]" />
              <input value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} placeholder="Recipient email" className="min-h-11 rounded-xl border border-[#d8e0ea] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[#99f6e4] focus:ring-4 focus:ring-[#ccfbf1]" />
              <input value={emailSubject} onChange={(event) => setEmailSubject(event.target.value)} placeholder="Subject" className="min-h-11 rounded-xl border border-[#d8e0ea] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[#99f6e4] focus:ring-4 focus:ring-[#ccfbf1]" />
              <textarea value={emailBody} onChange={(event) => setEmailBody(event.target.value)} rows={5} className="resize-none rounded-xl border border-[#d8e0ea] bg-[#f8fafc] px-4 py-3 text-sm leading-6 outline-none focus:border-[#99f6e4] focus:ring-4 focus:ring-[#ccfbf1]" />
              <button onClick={sendEmail} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-bold text-white transition hover:bg-[#243041]">
                Send approved email
                <ArrowRight className="h-4 w-4" />
              </button>
              {mailStatus ? <p className="text-sm font-semibold text-[#526172]">{mailStatus}</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-[#d8e0ea] bg-white p-5 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#0f766e]" />
              <h2 className="text-lg font-semibold">AI-created work</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {workflow.platform_content.length ? workflow.platform_content.slice(0, 6).map((item, index) => (
                <div key={`${item.platform}-${index}`} className="rounded-xl border border-[#d8e0ea] bg-[#f8fafc] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold">{item.platform}</p>
                    <span className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-[#64748b] ring-1 ring-[#d8e0ea]">{item.tool}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">{item.content_type}</p>
                  <p className="mt-1 line-clamp-5 whitespace-pre-line text-sm leading-6 text-[#334155]">{item.draft}</p>
                </div>
              )) : (
                <div className="rounded-xl border border-[#d8e0ea] bg-[#f8fafc] p-4 text-sm leading-6 text-[#526172]">
                  Generate a workflow first, then return here to see AI-created drafts and execution outputs.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
