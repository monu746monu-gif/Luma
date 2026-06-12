"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  UserCheck,
  X,
} from "lucide-react";
import type {
  GeneratedWorkflow,
  ProductInput,
  WorkflowNodeData,
} from "@/components/dashboard/types";

type ExpandedWorkflowNode = WorkflowNodeData & {
  hover_summary?: string;
  expanded_details?: string[];
  outputs?: string[];
  human_role?: string;
  ai_role?: string;
  tools_needed?: string[];
  next_action?: string;
};

function makeInputFromPrompt(prompt: string, apiKey: string): ProductInput {
  return {
    apiKey,
    productName: "User product",
    description: prompt,
    targetAudience: "Infer from prompt",
    currentStage: "Infer from prompt",
    desiredWorkflow: prompt,
    launchGoal: "Create and track a marketing workflow",
    tone: "Clear, practical, platform-native",
    teamSize: "Infer from prompt",
    teamRoles: "Founder, Marketing, Product, Sales, Support",
    aiAgents: "ChatGPT, Claude, Perplexity",
    tools: "Slack, Gmail, X, LinkedIn, Reddit, Product Hunt, Notion",
  };
}

function makeFallbackWorkflow(prompt: string): GeneratedWorkflow {
  return {
    product_brain: {
      summary:
        prompt ||
        "Luma will learn the product context and turn it into a marketing workflow.",
      positioning:
        "A practical marketing workflow built from the user's prompt, with AI-safe work separated from human-owned decisions.",
      best_channels: ["X", "Reddit", "Email", "LinkedIn", "Product Hunt"],
      core_audience: [
        "Early customers",
        "Relevant communities",
        "Product-aware prospects",
      ],
    },
    workflow: [
      {
        id: "1",
        title: "Define Launch Strategy",
        description:
          "Luma creates the launch angle, Product Hunt brief, screenshot plan, and demo video plan.",
        owner: "ai",
        agent: "Luma Strategy Agent",
        status: "ready",
        app: "Luma",
        icon: "rocket",
        hover_summary:
          "Luma studies the product, audience, launch goal, and category to build the full launch strategy. It decides the Product Hunt angle, the core promise, the launch assets, and the first channels the product should use.",
        expanded_details: [
          "Define the product promise, target audience, and strongest launch angle from the product input.",
          "Create Product Hunt launch requirements: tagline, description, maker comment, feature bullets, and launch order.",
          "Plan the launch assets: 3 product screenshots, 1 short demo video, and the proof/value visual that supports the launch claim.",
          "Outline the demo video flow: problem, product walkthrough, key feature, outcome, and CTA.",
          "Recommend where the product should launch first and which channels should support the main launch day.",
          "Create a day-before-launch checklist so the founder knows exactly what must be ready before content creation starts.",
        ],
        outputs: [
          "Launch strategy",
          "Product Hunt plan",
          "Screenshot checklist",
          "Demo video plan",
          "Channel strategy",
        ],
        human_role:
          "Founder approves the positioning and launch promise before public content is created or shared.",
        ai_role:
          "Luma automatically creates the strategy, launch assets checklist, channel plan, and Product Hunt brief from the product context.",
        tools_needed: ["Luma", "Product Hunt", "Screen Studio", "Canva"],
        next_action: "Generate launch strategy",
      } as ExpandedWorkflowNode,
      {
        id: "2",
        title: "Create Marketing Content",
        description:
          "AI creates platform-specific content for Product Hunt, X, LinkedIn, Reddit, and email.",
        owner: "ai",
        agent: "Content Agent",
        status: "ready",
        app: "X + LinkedIn + Reddit",
        icon: "message",
        hover_summary:
          "Luma turns the launch strategy into content for the best SaaS marketing platforms. It writes separate posts for Product Hunt, X, LinkedIn, Reddit, and Email so the message feels native on each channel instead of copied everywhere.",
        expanded_details: [
          "Create Product Hunt tagline, description, maker comment, and launch copy that matches the launch strategy.",
          "Create X launch post, founder thread, teaser post, and follow-up post for launch week.",
          "Create LinkedIn founder story and professional launch post that explain why the product matters.",
          "Create Reddit feedback-style post that sounds helpful, not spammy, and fits the community tone.",
          "Create cold email and follow-up email draft for early customers and supporters.",
          "Suggest which screenshot, demo clip, or product visual should go with each post.",
          "Prepare the content so the user can move into a dedicated content creation page after generation.",
        ],
        outputs: [
          "X post",
          "LinkedIn post",
          "Reddit post",
          "Product Hunt copy",
          "Cold email",
        ],
        human_role:
          "Human reviews all public-facing content before it is posted or sent anywhere.",
        ai_role:
          "Luma writes first drafts for every selected platform and prepares them for approval and posting.",
        tools_needed: ["X", "LinkedIn", "Reddit", "Product Hunt", "Email"],
        next_action: "Generate content",
      } as ExpandedWorkflowNode,
      {
        id: "3",
        title: "Review Marketing Content",
        description:
          "Humans approve clarity, tone, positioning, spam risk, and public claims.",
        owner: "human",
        agent: "Founder Review",
        status: "waiting",
        app: "Luma",
        icon: "userCheck",
        hover_summary:
          "This step keeps humans in control of public messaging. Luma can suggest improvements, but a human must approve the final Product Hunt copy, social posts, and emails before anything goes live.",
        expanded_details: [
          "Check if the product promise is accurate and not overhyped.",
          "Check if the Product Hunt copy is clear in the first few seconds and uses direct language.",
          "Check if Reddit content sounds helpful instead of promotional or copied from another channel.",
          "Check if email content feels personal, relevant, and appropriate for the recipient.",
          "Check if each post has a clear CTA, the right asset attached, and the right platform fit.",
          "Approve, edit, or regenerate weak content before the system moves to scheduling.",
        ],
        outputs: [
          "Approved posts",
          "Approved Product Hunt copy",
          "Approved email",
          "Final launch messaging",
        ],
        human_role:
          "Founder or team approves, edits, or rejects the final message before posting.",
        ai_role:
          "Luma highlights weak CTAs, tone mismatch, unclear claims, spam risk, and missing assets.",
        tools_needed: ["Luma"],
        next_action: "Review content",
      } as ExpandedWorkflowNode,
      {
        id: "4",
        title: "Schedule Social Posts",
        description:
          "Luma saves approved posts as drafts and creates the launch posting schedule.",
        owner: "ai",
        agent: "Scheduling Agent",
        status: "ready",
        app: "X + LinkedIn",
        icon: "calendar",
        hover_summary:
          "After human approval, Luma organizes the posts into a launch timeline. It saves drafts for the connected platforms, suggests the best posting order, and only schedules or posts when the human has verified the final copy.",
        expanded_details: [
          "Create a 24-hour launch-day posting schedule with teaser, launch, reminder, and follow-up slots.",
          "Attach the best screenshot, product clip, or demo video frame to each post.",
          "Save the approved content as drafts on the connected platforms when direct posting is not enabled.",
          "Only move a post to scheduled or published status after human verification.",
          "Keep track of drafted, approved, scheduled, and published states so nothing is posted too early.",
          "Prepare the launch sequence so social media supports the Product Hunt launch instead of competing with it.",
        ],
        outputs: [
          "Posting schedule",
          "Drafted posts",
          "Follow-up plan",
          "Approval status",
        ],
        human_role:
          "Human verifies the final posts and gives permission to publish or schedule them.",
        ai_role:
          "Luma creates the timing plan, organizes drafts, and updates workflow status after approval.",
        tools_needed: ["X", "LinkedIn", "Calendar", "Luma"],
        next_action: "Schedule approved posts",
      } as ExpandedWorkflowNode,
      {
        id: "5",
        title: "Send Outreach Emails",
        description:
          "AI drafts emails and sends approved outreach through email integration.",
        owner: "ai",
        agent: "Email Agent",
        status: "ready",
        app: "Resend",
        icon: "mail",
        hover_summary:
          "Luma creates outreach emails for expected customers, early supporters, and possible beta users. It prepares subject lines, follow-ups, and recipient logic, but nothing is sent until a human approves the final version.",
        expanded_details: [
          "Define expected customer segments from the product, audience, and launch goal.",
          "Create cold email draft for early beta users, expected customers, and warm contacts.",
          "Create follow-up email for people who do not reply after the first message.",
          "Ask the human to approve the final message, recipients, and send timing.",
          "Send using the email integration only after approval is granted.",
          "Track sent, pending, replied, and follow-up status so outreach stays organized.",
        ],
        outputs: [
          "Cold email",
          "Follow-up email",
          "Recipient strategy",
          "Email tracking status",
        ],
        human_role:
          "Human approves the final email and confirms when it can be sent.",
        ai_role:
          "Luma writes email drafts, creates follow-ups, and sends approved emails through Resend.",
        tools_needed: ["Resend", "Email", "Luma"],
        next_action: "Prepare outreach email",
      } as ExpandedWorkflowNode,
      {
        id: "6",
        title: "Track Marketing",
        description:
          "Luma tracks generated content, approvals, scheduled posts, outreach, and follow-ups.",
        owner: "system",
        agent: "Tracking Agent",
        status: "ready",
        app: "Luma",
        icon: "activity",
        hover_summary:
          "Luma keeps the launch workflow traceable. It shows what has been generated, what is approved, what is pending, and what needs follow-up.",
        expanded_details: [
          "Track generated assets and content.",
          "Track what still needs human approval.",
          "Track social post draft and schedule status.",
          "Track sent emails and pending follow-ups.",
          "Track Product Hunt launch readiness.",
          "Suggest next actions after launch.",
        ],
        outputs: [
          "Trace timeline",
          "Pending tasks",
          "Approval queue",
          "Follow-up list",
        ],
        human_role:
          "Human checks results and decides what should be repeated or improved.",
        ai_role:
          "Luma summarizes progress, detects blockers, and recommends next actions.",
        tools_needed: ["Luma", "Email", "Social platforms"],
        next_action: "Track launch progress",
      } as ExpandedWorkflowNode,
    ],
    platform_content: [
      {
        platform: "X",
        content_type: "Post set",
        draft:
          "Write a concise product story, problem post, proof post, and CTA post.",
        owner: "AI draft, human approve",
        tool: "X",
      },
      {
        platform: "Reddit",
        content_type: "Comment plan",
        draft:
          "Find relevant threads, answer the actual problem first, and mention the product only where useful.",
        owner: "AI draft, human approve",
        tool: "Reddit",
      },
      {
        platform: "Email",
        content_type: "Outreach sequence",
        draft:
          "Create a short customer email with one pain point, one benefit, and one low-friction ask.",
        owner: "AI draft, human send",
        tool: "Gmail",
      },
    ],
    human_tasks: [
      {
        title: "Approve strategy",
        reason:
          "Positioning and claims should be reviewed before public content.",
      },
      {
        title: "Review posts",
        reason: "Public posts and Reddit comments can affect brand trust.",
      },
      {
        title: "Send sensitive outreach",
        reason: "Relationship-heavy messages should stay human-owned.",
      },
    ],
    ai_tasks: [
      { title: "Extract product context", tool: "Luma" },
      { title: "Recommend best channels", tool: "Perplexity" },
      { title: "Draft X and Reddit content", tool: "ChatGPT" },
      { title: "Create campaign schedule", tool: "Luma" },
    ],
    trace: [
      "Prompt received",
      "Workflow generated",
      "Human and AI work separated",
      "Marketing tracker ready",
    ],
  };
}

function SlackLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 122.8 122.8" className={className} aria-hidden="true">
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z" fill="#E01E5A" />
      <path d="M32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2z" fill="#36C5F0" />
      <path d="M45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z" fill="#2EB67D" />
      <path d="M90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9z" fill="#ECB22E" />
      <path d="M77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
    </svg>
  );
}

function XLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18.244 2H21.5l-7.11 8.13L22.75 22h-6.54l-5.12-6.68L5.23 22H1.97l7.61-8.7L1.56 2h6.71l4.63 6.12L18.244 2Zm-1.14 17.9h1.8L7.29 3.99H5.36L17.104 19.9Z" />
    </svg>
  );
}

function LinkedInLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.84v2.05h.06c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.85c0-1.87-.03-4.27-2.6-4.27-2.6 0-3 2.03-3 4.13V23h-4V8Z" />
    </svg>
  );
}

function RedditLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M24 11.78a2.64 2.64 0 0 0-4.48-1.89c-1.81-1.2-4.25-1.95-6.95-2.04l1.18-5.56 3.86.82a1.86 1.86 0 1 0 .3-1.39L13.42.77a.7.7 0 0 0-.83.54l-1.39 6.53c-2.75.08-5.24.83-7.08 2.04A2.64 2.64 0 1 0 1.22 14.2a4.9 4.9 0 0 0-.06.75c0 3.94 4.85 7.13 10.84 7.13s10.84-3.19 10.84-7.13c0-.25-.02-.5-.06-.75A2.64 2.64 0 0 0 24 11.78ZM6.8 13.82a1.46 1.46 0 1 1 2.92 0 1.46 1.46 0 0 1-2.92 0Zm8.66 4.2c-1 .99-2.9 1.06-3.46 1.06-.57 0-2.46-.07-3.46-1.06a.7.7 0 0 1 .99-.99c.63.63 2.05.65 2.47.65.42 0 1.84-.02 2.47-.65a.7.7 0 1 1 .99.99Zm-.18-4.2a1.46 1.46 0 1 1 2.92 0 1.46 1.46 0 0 1-2.92 0Z" />
    </svg>
  );
}

function MailLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function ConnectToolsBar({
  slackConnected,
  showStartExecution = false,
}: {
  slackConnected: boolean;
  showStartExecution?: boolean;
}) {
  const tools = [
    {
      name: "Slack",
      connected: slackConnected,
      logo: <SlackLogo className="h-4 w-4" />,
      href: "/api/slack/connect",
      color: "text-[#4A154B]",
    },
    {
      name: "X",
      connected: false,
      logo: <XLogo className="h-4 w-4" />,
      href: "/api/x/connect",
      color: "text-black",
    },
    {
      name: "LinkedIn",
      connected: false,
      logo: <LinkedInLogo className="h-4 w-4" />,
      href: "/api/linkedin/connect",
      color: "text-[#0A66C2]",
    },
    {
      name: "Reddit",
      connected: false,
      logo: <RedditLogo className="h-4 w-4" />,
      href: "/api/reddit/connect",
      color: "text-[#FF4500]",
    },
    {
      name: "Email",
      connected: true,
      logo: <MailLogo className="h-4 w-4" />,
      href: "/dashboard/settings/email",
      color: "text-[#0f766e]",
    },
  ];

  return (
    <div className="mx-auto mt-3 flex w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-[#d8e0ea] bg-white/90 px-3 py-2 shadow-[0_12px_30px_rgba(18,24,38,0.10)]">
      <span className="text-xs font-bold text-[#526172]">Connect your tools</span>

      <div className="h-4 w-px bg-[#d8e0ea]" />

      <div className="flex items-center gap-1.5">
        {tools.map((tool) => (
          <button
            key={tool.name}
            type="button"
            title={tool.connected ? `${tool.name} connected` : `Connect ${tool.name}`}
            onClick={() => {
              if (tool.name === "Slack" && slackConnected) return;

              if (tool.name === "X" || tool.name === "LinkedIn" || tool.name === "Reddit") {
                alert(`${tool.name} connection coming soon. For now Luma will generate ${tool.name} drafts.`);
                return;
              }

              window.location.href = tool.href;
            }}
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition hover:-translate-y-0.5 hover:shadow-md ${
              tool.connected
                ? "border-[#bbf7d0] bg-[#f0fdf4]"
                : "border-[#d8e0ea] bg-[#f8fafc] hover:bg-white"
            } ${tool.color}`}
          >
            {tool.logo}
            {tool.connected ? (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white bg-[#22c55e]" />
            ) : null}
          </button>
        ))}
      </div>

      {showStartExecution ? (
        <>
          <div className="hidden h-4 w-px bg-[#d8e0ea] sm:block" />
          <Link
            href="/dashboard/execute"
            className="inline-flex min-h-8 items-center justify-center gap-2 rounded-full bg-[#111827] px-3.5 py-1.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#243041]"
          >
            Start execution
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </>
      ) : null}
    </div>
  );
}

function displayText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    return value.map(displayText).filter(Boolean).join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).map(displayText).filter(Boolean).join(" — ");
  }

  return "";
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(displayText).filter(Boolean);
}

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [workflow, setWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [selectedStep, setSelectedStep] = useState<ExpandedWorkflowNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [slackConnected, setSlackConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedFromUrl = params.get("slack") === "connected";
    const connectedFromStorage =
      window.localStorage.getItem("luma_slack_connected") === "true";

    if (connectedFromUrl) {
      window.localStorage.setItem("luma_slack_connected", "true");
    }

    setSlackConnected(connectedFromUrl || connectedFromStorage);
  }, []);

  async function generateWorkflow() {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setToast("Write what you want Luma to plan first.");
      window.setTimeout(() => setToast(""), 3000);
      return;
    }

    setIsLoading(true);
    setToast("");
    setSelectedStep(null);

    try {
      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(makeInputFromPrompt(trimmedPrompt, apiKey.trim())),
      });

      if (!response.ok) {
        throw new Error("Workflow generation failed");
      }

      const data = (await response.json()) as GeneratedWorkflow;
      setWorkflow(data);
      window.localStorage.setItem("luma_execution_workflow", JSON.stringify(data));
      window.localStorage.setItem("luma_execution_prompt", trimmedPrompt);
    } catch {
      const fallbackWorkflow = makeFallbackWorkflow(trimmedPrompt);
      setWorkflow(fallbackWorkflow);
      window.localStorage.setItem("luma_execution_workflow", JSON.stringify(fallbackWorkflow));
      window.localStorage.setItem("luma_execution_prompt", trimmedPrompt);
      setToast("Demo workflow generated. Add OPENAI_API_KEY in .env.local for live generation.");
      window.setTimeout(() => setToast(""), 4200);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#111827]">
      <div className="min-h-screen bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-8">
          <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
            <div className="text-center">
              <div className="relative mx-auto h-14 w-14 overflow-hidden rounded-2xl border border-[#d8e0ea] bg-white shadow-sm">
                <Image
                  src="/logo.jpeg"
                  alt="Luma logo"
                  fill
                  sizes="56px"
                  className="object-cover object-center"
                  priority
                />
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                What should Luma plan?
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#526172]">
                Describe your product and what marketing workflow you want.
                Luma will generate the plan, human tasks, AI tasks, content,
                and tracking.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-[#d8e0ea] bg-white/92 p-3 shadow-[0_24px_70px_rgba(18,24,38,0.10)] backdrop-blur">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={6}
                placeholder="Example: We are launching an AI notes app. Plan marketing for X, Reddit, email, and Slack. Assign what humans should approve and what AI should create."
                className="min-h-[150px] w-full resize-none rounded-xl border border-transparent bg-[#f8fafc] px-4 py-4 text-base leading-7 text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#99f6e4] focus:bg-white focus:ring-4 focus:ring-[#ccfbf1]"
              />

              <input
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="OpenAI API key (optional)"
                className="mt-3 w-full rounded-xl border border-transparent bg-[#f8fafc] px-4 py-3 text-sm font-medium text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#99f6e4] focus:bg-white focus:ring-4 focus:ring-[#ccfbf1]"
              />

              <div className="mt-3 flex justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/dashboard/content"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8e0ea] bg-white px-5 py-3 text-sm font-bold text-[#111827] shadow-[0_14px_30px_rgba(18,24,38,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f8fafc]"
                  >
                    Generate draft
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={generateWorkflow}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(18,24,38,0.18)] transition hover:-translate-y-0.5 hover:bg-[#243041] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      <>
                        Generate workflow
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <ConnectToolsBar slackConnected={slackConnected} showStartExecution={Boolean(workflow)} />

            {workflow ? (
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-5"
              >
                <div className="rounded-2xl border border-[#d8e0ea] bg-white/92 p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">
                    Strategy
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    {workflow.product_brain.positioning || "Marketing workflow"}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {workflow.product_brain.best_channels
                      .slice(0, 6)
                      .map((channel, index) => (
                        <span
                          key={`channel-${index}`}
                          className="rounded-full bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold text-[#0f766e]"
                        >
                          {displayText(channel)}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  {workflow.workflow.map((step, index) => {
                    const expandedStep = step as ExpandedWorkflowNode;
                    const isHuman = expandedStep.owner === "human";

                    return (
                      <button
                        key={`${expandedStep.id}-${expandedStep.title}`}
                        onClick={() => setSelectedStep(expandedStep)}
                        className="group rounded-2xl border border-[#d8e0ea] bg-white/92 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isHuman
                                ? "bg-[#eef2f7] text-[#334155]"
                                : "bg-[#ecfdf5] text-[#0f766e]"
                            }`}
                          >
                            {isHuman ? (
                              <UserCheck className="h-5 w-5" />
                            ) : (
                              <Bot className="h-5 w-5" />
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-semibold">
                                {expandedStep.title}
                              </h3>

                              <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-bold text-[#64748b]">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>

                            <p className="mt-1 text-sm leading-6 text-[#526172]">
                              {expandedStep.description}
                            </p>

                            <div className="mt-3 max-h-0 overflow-hidden rounded-xl border border-transparent bg-[#f8fafc] p-0 opacity-0 transition-all duration-300 group-hover:max-h-[18rem] group-hover:border-[#d8e0ea] group-hover:p-3 group-hover:opacity-100">
                              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#64748b]">
                                More detail
                              </p>
                              <p className="mt-1 text-xs leading-5 text-[#526172]">
                                {expandedStep.hover_summary ||
                                  "Hover to see the full strategy for this step."}
                              </p>

                              {stringArray(expandedStep.expanded_details)
                                .slice(0, 3)
                                .length > 0 ? (
                                <ul className="mt-2 space-y-1.5">
                                  {stringArray(expandedStep.expanded_details)
                                    .slice(0, 3)
                                    .map((detail, detailIndex) => (
                                      <li
                                        key={`${expandedStep.id}-hover-${detailIndex}`}
                                        className="text-[11px] leading-5 text-[#526172]"
                                      >
                                        {detail}
                                      </li>
                                    ))}
                                </ul>
                              ) : null}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#f8fafc] px-2.5 py-1 text-xs font-bold text-[#334155]">
                                {isHuman ? (
                                  <UserCheck className="h-3.5 w-3.5" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                )}
                                {isHuman
                                  ? "Human"
                                  : expandedStep.owner === "system"
                                    ? "Tracking"
                                    : "AI"}
                              </span>

                              <span className="rounded-full bg-[#f8fafc] px-2.5 py-1 text-xs font-bold text-[#334155]">
                                {expandedStep.app}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.section>
            ) : null}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {selectedStep ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/35 px-4 py-6 backdrop-blur-sm"
            onClick={() => setSelectedStep(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#d8e0ea] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">
                    Expanded workflow step
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#111827]">
                    {selectedStep.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#526172]">
                    {selectedStep.hover_summary || selectedStep.description}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedStep(null)}
                  className="rounded-full border border-[#d8e0ea] p-2 text-[#64748b] transition hover:bg-[#f8fafc]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    What Luma will do
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {stringArray(selectedStep.expanded_details).map(
                      (detail, index) => (
                        <li
                          key={`detail-${index}`}
                          className="rounded-xl bg-[#f8fafc] px-3 py-2 text-sm leading-6 text-[#526172]"
                        >
                          {detail}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Outputs</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stringArray(selectedStep.outputs).map((output, index) => (
                      <span
                        key={`output-${index}`}
                        className="rounded-full bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold text-[#0f766e]"
                      >
                        {output}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#d8e0ea] bg-[#f8fafc] p-4">
                    <h3 className="text-sm font-bold text-[#111827]">
                      AI role
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#526172]">
                      {selectedStep.ai_role ||
                        "Luma generates drafts, strategy, research, and repeatable execution tasks."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#d8e0ea] bg-[#f8fafc] p-4">
                    <h3 className="text-sm font-bold text-[#111827]">
                      Human role
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#526172]">
                      {selectedStep.human_role ||
                        "Humans approve, edit, and handle final public or sensitive actions."}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    Tools needed
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stringArray(selectedStep.tools_needed).map(
                      (tool, index) => (
                        <span
                          key={`tool-${index}`}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#334155] ring-1 ring-[#d8e0ea]"
                        >
                          {tool}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (selectedStep.title.toLowerCase().includes("content")) {
                      window.location.href = "/dashboard/content";
                      return;
                    }

                    setToast(`${selectedStep.next_action || "Step"} selected.`);
                    window.setTimeout(() => setToast(""), 3000);
                  }}
                  className="w-full rounded-2xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#243041]"
                >
                  {selectedStep.next_action || "Run this step"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-xl border border-[#d8e0ea] bg-white px-4 py-3 text-sm font-semibold text-[#334155] shadow-[0_18px_50px_rgba(18,24,38,0.14)]"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
