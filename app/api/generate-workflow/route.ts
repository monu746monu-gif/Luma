import { NextResponse } from "next/server";
import type {
  GeneratedWorkflow,
  ProductInput,
  WorkflowNodeData,
} from "@/components/dashboard/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";
const MAX_POST_WORDS = 100;

type DetailedWorkflowNodeData = WorkflowNodeData & {
  hover_summary?: string;
  expanded_details?: string[];
  outputs?: string[];
  human_role?: string;
  ai_role?: string;
  tools_needed?: string[];
  next_action?: string;
};

type DetailedGeneratedWorkflow = Omit<GeneratedWorkflow, "workflow"> & {
  workflow: DetailedWorkflowNodeData[];
  flow_nodes?: DetailedWorkflowNodeData[];
};

function safeArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;

      if (typeof item === "number" || typeof item === "boolean") {
        return String(item);
      }

      if (typeof item === "object" && item !== null) {
        return Object.values(item)
          .map((v) => {
            if (typeof v === "string") return v;
            if (typeof v === "number" || typeof v === "boolean") return String(v);
            return "";
          })
          .filter(Boolean)
          .join(" — ");
      }

      return "";
    })
    .filter(Boolean);
}

function limitWords(text: string, maxWords = MAX_POST_WORDS) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(" ");
}

function normalizeNode(node: DetailedWorkflowNodeData, index: number): DetailedWorkflowNodeData {
  const owner =
    node.owner === "human" || node.owner === "system"
      ? node.owner
      : "ai";

  return {
    id: String(node.id ?? index + 1),
    title: node.title ?? `Workflow task ${index + 1}`,
    description:
      node.description ??
      "A concrete step in the human + AI first-100-users workflow.",
    owner,
    agent: node.agent ?? "Luma Agent",
    status: node.status ?? "ready",
    app: node.app ?? "Luma",
    icon: node.icon ?? "bot",
    x: typeof node.x === "number" ? node.x : undefined,
    y: typeof node.y === "number" ? node.y : undefined,
    layoutGroup: node.layoutGroup ?? undefined,
    colorTone:
      node.colorTone ??
      (owner === "human" ? "human" : owner === "system" ? "system" : "ai"),
    action_type: node.action_type ?? "generate",
    requires_approval:
      typeof node.requires_approval === "boolean"
        ? node.requires_approval
        : owner === "human",
    detailed_plan: toStringArray(node.detailed_plan).length
      ? toStringArray(node.detailed_plan)
      : toStringArray(node.expanded_details),
    execution_button_label:
      node.execution_button_label ?? node.next_action ?? "Generate",

    hover_summary:
      node.hover_summary ??
      "Luma explains what happens in this step, what AI will do, and where human approval is needed.",

    expanded_details: toStringArray(node.expanded_details).length
      ? toStringArray(node.expanded_details)
      : [
          "Understand the current product and audience context.",
          "Create practical outputs for this first-100-users workflow stage.",
          "Separate AI work from human approval work.",
          "Update the trace timeline after completion.",
        ],

    outputs: toStringArray(node.outputs).length
      ? toStringArray(node.outputs)
      : ["Workflow output", "Next action", "Trace update"],

    human_role:
      node.human_role ??
      "Review, approve, or edit the output before it becomes public or final.",

    ai_role:
      node.ai_role ??
      "Generate drafts, research, structure, and repeatable execution tasks.",

    tools_needed: toStringArray(node.tools_needed).length
      ? toStringArray(node.tools_needed)
      : [node.app ?? "Luma"],

    next_action: node.next_action ?? node.execution_button_label ?? "Run this step",
  };
}

function normalizeWorkflow(data: DetailedGeneratedWorkflow): DetailedGeneratedWorkflow {
  const sourceWorkflow = Array.isArray(data.flow_nodes) && data.flow_nodes.length
    ? data.flow_nodes
    : Array.isArray(data.workflow)
      ? data.workflow
      : [];
  const workflow = sourceWorkflow.slice(0, 9).map(normalizeNode);
  const platformContent = Array.isArray(data.platform_content)
    ? data.platform_content.slice(0, 12)
    : [];

  return {
    product_brain: {
      summary: data.product_brain?.summary ?? "",
      positioning: data.product_brain?.positioning ?? "",
      best_channels: Array.isArray(data.product_brain?.best_channels)
        ? data.product_brain.best_channels
        : [],
      core_audience: Array.isArray(data.product_brain?.core_audience)
        ? data.product_brain.core_audience
        : [],
    },

    workflow,
    flow_nodes: workflow,

    daily_plan: Array.isArray(data.daily_plan)
      ? data.daily_plan.slice(0, 7).map((day, index) => ({
          day: Number(day.day ?? index + 1),
          daily_goal: day.daily_goal ?? `Day ${index + 1} acquisition goal`,
          platforms: toStringArray(day.platforms),
          x_posts: toStringArray(day.x_posts).slice(0, 2),
          linkedin_post: day.linkedin_post ?? "",
          reddit_community_action: day.reddit_community_action ?? "",
          cold_outreach_task: day.cold_outreach_task ?? "",
          expected_output: day.expected_output ?? "",
          human_approval_needed: Boolean(day.human_approval_needed),
        }))
      : [],

    customer_discovery: Array.isArray(data.customer_discovery)
      ? data.customer_discovery.slice(0, 6).map((target) => ({
          segment: target.segment ?? "Potential customer segment",
          where_to_find: toStringArray(target.where_to_find),
          linkedin_search_keywords: toStringArray(target.linkedin_search_keywords),
          x_search_keywords: toStringArray(target.x_search_keywords),
          reddit_communities: toStringArray(target.reddit_communities),
          product_hunt_audiences: toStringArray(target.product_hunt_audiences),
          founder_communities: toStringArray(target.founder_communities),
        }))
      : [],

    execution_points: Array.isArray(data.execution_points)
      ? data.execution_points.slice(0, 12).map((point, index) => ({
          id: String(point.id ?? `execution-${index + 1}`),
          title: point.title ?? `Execution point ${index + 1}`,
          what_ai_will_do: point.what_ai_will_do ?? point.title ?? "Luma will generate the requested output.",
          platform: point.platform ?? "Luma",
          requires_approval: Boolean(point.requires_approval),
          output_preview: point.output_preview ?? "Draft output will appear here.",
        }))
      : [],

    platform_content: platformContent.map((item) => ({
      platform: item.platform ?? "Platform",
      content_type: item.content_type ?? "Content draft",
      draft: limitWords(item.draft ?? ""),
      owner: item.owner ?? "Founder",
      tool: item.tool ?? "Luma",
    })),

    human_tasks: Array.isArray(data.human_tasks) ? data.human_tasks : [],
    ai_tasks: Array.isArray(data.ai_tasks) ? data.ai_tasks : [],
    trace: Array.isArray(data.trace) ? data.trace : [],
  };
}

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

function buildFallback(input: ProductInput): DetailedGeneratedWorkflow {
  const productName = input.productName || "Your product";
  const audience = input.targetAudience || "early adopters who already feel the problem";
  const nodes: DetailedWorkflowNodeData[] = [
    {
      id: "learn-product",
      title: "Learn Product Context",
      description: "Luma reads the prompt and Slack context to understand the product, audience, and offer.",
      owner: "ai",
      agent: "Product Brain Agent",
      status: "ready",
      app: "Slack + Luma",
      icon: "brain",
      x: 5,
      y: 35,
      layoutGroup: "input",
      colorTone: "ai",
      action_type: "generate",
      requires_approval: false,
      execution_button_label: "Generate product brain",
      hover_summary: "Luma turns the prompt and connected Slack context into product memory. It extracts the problem, target audience, promise, proof points, and constraints before creating any public content.",
      expanded_details: [
        "Summarize the product, target audience, category, and current stage.",
        "Pull useful Slack context only when Slack is connected.",
        "Identify the strongest pain point and first credible promise.",
        "List assumptions that need human confirmation.",
        "Prepare context for the first-100-users strategy.",
      ],
      outputs: ["Product summary", "Audience assumptions", "Positioning notes"],
      human_role: "Confirm any assumptions that affect public claims.",
      ai_role: "Extract product context and turn it into reusable memory.",
      tools_needed: ["Luma", "Slack"],
      next_action: "Generate product brain",
    },
      {
        id: "first-100-strategy",
        title: "Define First 100 Users Strategy",
        description: "Luma creates a 7-day acquisition plan aimed at the first 100 users.",
        owner: "ai",
        agent: "Growth Strategy Agent",
        status: "ready",
        app: "Luma",
        icon: "rocket",
        x: 29,
        y: 12,
        layoutGroup: "strategy",
        colorTone: "ai",
        action_type: "generate",
        requires_approval: false,
        execution_button_label: "Generate strategy",
        hover_summary: "The plan is not generic marketing advice. Luma breaks the week into daily goals, channel actions, drafts, outreach, feedback loops, and approval gates.",
        expanded_details: [
          "Define a realistic first-100-users target by channel.",
          "Pick the highest-signal daily actions for X, LinkedIn, Reddit, Product Hunt, Email, and communities.",
          "Create milestones for replies, conversations, waitlist signups, and demos.",
          "Separate content generation from public posting.",
          "Set checkpoints for strategy updates based on replies and approvals.",
        ],
        outputs: ["7-day acquisition plan", "Daily growth goals", "Approval gates"],
        human_role: "Approve positioning and any public-facing claims.",
        ai_role: "Create the first-100-users execution strategy.",
        tools_needed: ["Luma"],
        next_action: "Generate strategy",
      },
      {
        id: "find-platforms-segments",
        title: "Find Platforms and Segments",
        description: "Luma identifies where likely customers spend time and what to search for.",
        owner: "ai",
        agent: "Discovery Agent",
        status: "ready",
        app: "LinkedIn + X + Reddit",
        icon: "search",
        x: 55,
        y: 18,
        layoutGroup: "discovery",
        colorTone: "platform",
        action_type: "generate",
        requires_approval: false,
        execution_button_label: "Find targets",
        hover_summary: "Luma does not claim live scraping. It creates suggested search targets, potential customer segments, people to look for, and search keywords for each platform.",
        expanded_details: [
          "Create ideal customer/persona segments.",
          "Suggest LinkedIn search keywords and role filters.",
          "Suggest X search keywords and conversation patterns.",
          "Suggest Reddit communities and feedback-first entry points.",
          "Suggest Product Hunt similar product audiences and founder communities.",
        ],
        outputs: ["Potential customer segments", "Suggested search targets", "Search keywords"],
        human_role: "Pick which segments feel most aligned with the product.",
        ai_role: "Generate customer discovery targets without claiming live scraping.",
        tools_needed: ["LinkedIn", "X", "Reddit", "Product Hunt"],
        next_action: "Find targets",
      },
      {
        id: "daily-content",
        title: "Generate Daily Marketing Content",
        description: "Luma creates native daily content across X, LinkedIn, Reddit, Product Hunt, Email, and communities.",
        owner: "ai",
        agent: "Content Agent",
        status: "ready",
        app: "X + LinkedIn + Reddit",
        icon: "message",
        x: 26,
        y: 48,
        layoutGroup: "content",
        colorTone: "ai",
        action_type: "generate",
        requires_approval: true,
        execution_button_label: "Generate content",
        hover_summary: "For each day, Luma writes 2 X posts and 1 LinkedIn post, plus Reddit/community actions and outreach tasks. Everything public remains draft-only until a human approves it.",
        expanded_details: [
          "Generate 14 X posts across 7 days.",
          "Generate 7 LinkedIn posts across 7 days.",
          "Create feedback-style Reddit/community actions, not spam posts.",
          "Suggest Product Hunt and newsletter/community copy where useful.",
          "Prepare each item with a clear expected output.",
        ],
        outputs: ["14 X drafts", "7 LinkedIn drafts", "Reddit/community actions", "Product Hunt copy"],
        human_role: "Review public posts, claims, tone, and spam risk before use.",
        ai_role: "Create platform-native drafts for the whole week.",
        tools_needed: ["X", "LinkedIn", "Reddit", "Product Hunt", "Communities"],
        next_action: "Generate content",
      },
      {
        id: "find-people",
        title: "Find Important People",
        description: "Luma creates search targets for customers and influencers across X, LinkedIn, Reddit, and communities.",
        owner: "ai",
        agent: "Customer Discovery Agent",
        status: "ready",
        app: "X + LinkedIn + Reddit",
        icon: "users",
        x: 74,
        y: 45,
        layoutGroup: "discovery",
        colorTone: "platform",
        action_type: "generate",
        requires_approval: false,
        execution_button_label: "Generate search list",
        hover_summary: "Luma gives the user practical places to look, not fake scraped lists. The output is a search map: roles, keywords, communities, similar products, and founder spaces.",
        expanded_details: [
          "List people to look for by role, pain, and buying signal.",
          "Create LinkedIn and X search keywords.",
          "Suggest Reddit communities and threads to monitor.",
          "Suggest Product Hunt audiences from similar products.",
          "Suggest founder communities and newsletter angles.",
        ],
        outputs: ["People to look for", "Search keywords", "Community targets"],
        human_role: "Validate the final target list and avoid contacting irrelevant people.",
        ai_role: "Create a search-ready discovery map.",
        tools_needed: ["LinkedIn", "X", "Reddit", "Product Hunt", "Founder communities"],
        next_action: "Generate search list",
      },
      {
        id: "cold-outreach",
        title: "Create Cold Outreach Emails",
        description: "Luma writes cold email drafts and follow-ups for likely early customers.",
        owner: "ai",
        agent: "Email Agent",
        status: "ready",
        app: "Email",
        icon: "mail",
        x: 51,
        y: 70,
        layoutGroup: "outreach",
        colorTone: "ai",
        action_type: "generate",
        requires_approval: true,
        execution_button_label: "Generate emails",
        hover_summary: "Luma creates concise outreach drafts for potential customers and warm communities. It can save drafts, but it does not send emails publicly without human approval.",
        expanded_details: [
          "Write cold email drafts by persona.",
          "Write short follow-up emails.",
          "Personalize around pain and desired outcome.",
          "Keep asks low-friction: feedback, demo, early access, or reply.",
          "Mark every send as requiring approval first.",
        ],
        outputs: ["Cold email drafts", "Follow-up drafts", "Persona-specific outreach"],
        human_role: "Approve recipients, copy, and send timing before anything is sent.",
        ai_role: "Draft outreach and save copy for review.",
        tools_needed: ["Email", "Resend", "Gmail"],
        next_action: "Generate emails",
      },
      {
        id: "human-approval",
        title: "Ask Human Approval",
        description: "Humans review posts, emails, community copy, and positioning before public use.",
        owner: "human",
        agent: "Founder Review",
        status: "waiting",
        app: "Luma",
        icon: "userCheck",
        x: 78,
        y: 72,
        layoutGroup: "approval",
        colorTone: "human",
        action_type: "approve",
        requires_approval: true,
        execution_button_label: "Approve drafts",
        hover_summary: "This is the control point for all public posts and emails. Luma plans the strategy, does the repeatable work, and only asks humans for approval.",
        expanded_details: [
          "Review positioning and claims.",
          "Check X and LinkedIn drafts before posting.",
          "Check Reddit/community drafts for spam risk.",
          "Approve email drafts and recipient logic.",
          "Send approved items forward to draft saving or scheduling.",
        ],
        outputs: ["Approved drafts", "Edits requested", "Approval queue"],
        human_role: "Approve, edit, or reject all public-facing output.",
        ai_role: "Surface review items and update approval status.",
        tools_needed: ["Luma"],
        next_action: "Approve drafts",
      },
      {
        id: "schedule-save-drafts",
        title: "Schedule / Save Drafts",
        description: "Luma saves approved drafts and schedules only when approval exists.",
        owner: "system",
        agent: "Draft Operations Agent",
        status: "ready",
        app: "Calendar + Drafts",
        icon: "calendar",
        x: 26,
        y: 83,
        layoutGroup: "operations",
        colorTone: "system",
        action_type: "save_draft",
        requires_approval: true,
        execution_button_label: "Save drafts",
        hover_summary: "Approved outputs can be saved as drafts or scheduled. Luma never auto-posts publicly from this workflow without a human approval step.",
        expanded_details: [
          "Save X, LinkedIn, Reddit, Product Hunt, and email drafts.",
          "Create a suggested calendar for the 7-day plan.",
          "Respect approval status before scheduling.",
          "Keep unapproved drafts in waiting_approval.",
          "Track draft, scheduled, approved, and completed states.",
        ],
        outputs: ["Draft queue", "Suggested schedule", "Approval-aware status"],
        human_role: "Approve scheduling and public posting.",
        ai_role: "Organize approved drafts into a calendar and save them.",
        tools_needed: ["Calendar", "X", "LinkedIn", "Reddit", "Email"],
        next_action: "Save drafts",
      },
      {
        id: "track-growth",
        title: "Track Growth and Update Strategy",
        description:
          "Luma tracks replies, approvals, drafts, and progress toward the first 100 users.",
        owner: "system",
        agent: "Growth Tracker",
        status: "ready",
        app: "Luma",
        icon: "activity",
        x: 6,
        y: 67,
        layoutGroup: "tracking",
        colorTone: "system",
        action_type: "track",
        requires_approval: false,
        execution_button_label: "Track growth",
        hover_summary: "Luma watches execution status and updates the strategy from signals like replies, approvals, and draft volume. It keeps the first-100-users goal visible.",
        expanded_details: [
          "Track generated X, LinkedIn, Reddit, Product Hunt, and email drafts.",
          "Track approval state for every public item.",
          "Track replies, interested users, and first-100 progress.",
          "Suggest what to repeat or change each day.",
          "Save winning messages to product memory.",
        ],
        outputs: ["Growth tracker", "Approval tracker", "Updated strategy"],
        human_role: "Review results and decide what should be repeated or changed.",
        ai_role: "Track progress and recommend updates.",
        tools_needed: ["Luma", "Slack", "Email"],
        next_action: "Track growth",
      },
    ];

  return normalizeWorkflow({
    product_brain: {
      summary: `${productName} is ready for a 7-day execution plan focused on getting the first 100 users. Luma plans the strategy, does the repeatable work, and only asks humans for approval.`,
      positioning: `From one product prompt to a 7-day execution plan for your first 100 users.`,
      best_channels: [
        "X/Twitter — founder-led posts, replies, and daily proof",
        "LinkedIn — credible founder story and customer pain posts",
        "Reddit — feedback-first community posts and useful replies",
        "Product Hunt — similar product audiences and launch copy",
        "Email — direct outreach to potential early customers",
        "Slack / communities — context, warm intros, and founder groups",
      ],
      core_audience: [
        audience,
        "people already discussing this pain on X, LinkedIn, Reddit, and communities",
        "users of similar products who may want an alternative",
      ],
    },

    workflow: nodes,
    flow_nodes: nodes,

    platform_content: [
      {
        platform: "X",
        content_type: "Day 1 post 1",
        draft: `Building ${productName}. The goal this week is simple: talk to the first 100 people who feel the problem, learn fast, and turn every reply into a sharper product story. Looking for early feedback from ${audience}.`,
        owner: "AI drafts, human approves",
        tool: "X",
      },
      {
        platform: "X",
        content_type: "Day 1 post 2",
        draft: `Most early growth plans are too vague. For ${productName}, I am testing a 7-day loop: publish daily, ask communities for feedback, write direct outreach, track replies, and update the message every day.`,
        owner: "AI drafts, founder approves",
        tool: "X",
      },
      {
        platform: "LinkedIn",
        content_type: "Day 1 founder story",
        draft: `This week I am focused on getting the first 100 users for ${productName}. The plan is not to “post more.” It is to talk to the right people, share the product story clearly, ask for feedback in relevant communities, and personally follow up with people who already feel the problem.`,
        owner: "AI drafts, founder approves",
        tool: "LinkedIn",
      },
      {
        platform: "Reddit",
        content_type: "Feedback-style post",
        draft: `I am working on ${productName} for ${audience}. I am not trying to promo-drop; I am trying to understand the real workflow people use today. What is the most painful part of solving this problem right now?`,
        owner: "AI drafts, human posts manually",
        tool: "Reddit",
      },
      {
        platform: "Product Hunt",
        content_type: "Launch copy",
        draft: `${productName} helps ${audience} solve a painful workflow with a clear, practical path. Suggested PH angle: show the problem, the before/after, three concrete use cases, and invite makers to give feedback before a wider launch.`,
        owner: "AI drafts, founder approves",
        tool: "Product Hunt",
      },
      {
        platform: "Email",
        content_type: "Cold outreach email",
        draft: `Subject: Quick feedback on ${productName}?\n\nHey [Name], I am building ${productName} for ${audience}. I noticed you may care about [pain]. Would you be open to a quick look and blunt feedback? No pitch, just trying to learn from the right people.`,
        owner: "AI drafts, human approves, Resend sends",
        tool: "Resend",
      },
    ],

    daily_plan: Array.from({ length: 7 }, (_, index) => {
      const day = index + 1;
      return {
        day,
        daily_goal: [
          "Validate the sharpest pain and offer.",
          "Find reachable early customer segments.",
          "Start useful public conversations.",
          "Turn replies into warmer outreach.",
          "Prepare Product Hunt and community copy.",
          "Push for demos, feedback calls, and waitlist joins.",
          "Summarize signals and update the strategy.",
        ][index],
        platforms: ["X/Twitter", "LinkedIn", "Reddit", "Email", day >= 5 ? "Product Hunt" : "Communities"],
        x_posts: [
          `Day ${day}: one thing I am learning while building ${productName} for ${audience}: the real pain is usually more specific than the category name. Looking for people who feel this problem now.`,
          `Day ${day}: testing a first-100-users loop for ${productName}: useful post, direct replies, feedback-first community ask, personal outreach, then update the message from replies.`,
        ],
        linkedin_post: `Day ${day} update for ${productName}: I am focusing on conversations over vanity metrics. The goal is to identify who has the problem, what words they use, and what would make them try the product this week.`,
        reddit_community_action: "Ask a feedback-first question in one relevant community or reply helpfully to existing threads. Do not post promotional copy.",
        cold_outreach_task: `Send 10 personalized feedback requests to people matching the suggested search targets for ${productName}.`,
        expected_output: "Drafts created, replies tracked, approval queue updated, and strategy notes improved.",
        human_approval_needed: true,
      };
    }),

    customer_discovery: [
      {
        segment: audience,
        where_to_find: ["LinkedIn role searches", "X keyword searches", "Reddit problem threads", "Founder communities"],
        linkedin_search_keywords: [`${audience} workflow`, `${productName} alternative`, "founder operations", "growth marketing"],
        x_search_keywords: [`need a better way to ${input.description || "solve this"}`, `${productName}`, "looking for tool", "manual workflow"],
        reddit_communities: ["r/SaaS", "r/startups", "r/Entrepreneur", "category-specific communities"],
        product_hunt_audiences: ["Users of similar products", "Makers who upvote productivity and SaaS tools"],
        founder_communities: ["Indie Hackers", "YC Startup School", "Slack founder groups", "newsletter communities"],
      },
    ],

    execution_points: [
      { id: "x-day-1", title: "Create Day 1 X posts", what_ai_will_do: "I will create 2 X posts for Day 1", platform: "X", requires_approval: true, output_preview: "Two short founder-led posts for review." },
      { id: "linkedin-story", title: "Create LinkedIn founder story", what_ai_will_do: "I will create 1 LinkedIn founder story post", platform: "LinkedIn", requires_approval: true, output_preview: "One professional post with the first-100-users angle." },
      { id: "find-customers", title: "Find customer profiles", what_ai_will_do: "I will find customer profiles from LinkedIn, X, and Reddit", platform: "Search targets", requires_approval: false, output_preview: "Suggested search targets, segments, and keywords." },
      { id: "cold-emails", title: "Create cold email drafts", what_ai_will_do: "I will create cold email drafts", platform: "Email", requires_approval: true, output_preview: "Persona-specific cold email and follow-up drafts." },
      { id: "ph-copy", title: "Prepare Product Hunt copy", what_ai_will_do: "I will prepare Product Hunt launch copy", platform: "Product Hunt", requires_approval: true, output_preview: "Tagline, description, maker comment, and launch checklist." },
      { id: "track-growth", title: "Track growth loop", what_ai_will_do: "I will track replies, approvals, and growth", platform: "Luma", requires_approval: false, output_preview: "Execution statuses and first-100 progress." },
    ],

    human_tasks: [
      {
        title: "Approve first-100-users positioning",
        reason:
          "The message affects every public post, email, and community interaction.",
      },
      {
        title: "Review public content",
        reason:
          "Humans should verify tone, claims, clarity, and spam risk before anything goes public.",
      },
      {
        title: "Approve emails before sending",
        reason:
          "Outreach should be reviewed for personalization, accuracy, and relationship risk.",
      },
      {
        title: "Choose final communities",
        reason:
          "Community posting requires judgment because each community has different rules and expectations.",
      },
    ],

    ai_tasks: [
      {
        title: "Generate first-100-users strategy",
        tool: "Luma Strategy Agent",
      },
      {
        title: "Create 7-day platform content",
        tool: "Content Agent",
      },
      {
        title: "Draft cold outreach emails and follow-ups",
        tool: "Email Agent + Resend",
      },
      {
        title: "Prepare Reddit/community posts",
        tool: "Community Agent",
      },
      {
        title: "Create launch calendar and tracking workflow",
        tool: "Planner Agent + Tracker Agent",
      },
    ],

    trace: [
      "Luma learned the product prompt and available Slack context",
      "First-100-users strategy created",
      "Suggested search targets and customer segments prepared",
      "7-day content and outreach plan generated",
      "Human approval gates added before public posts and email sends",
      "Draft saving and tracking workflow prepared",
    ],
  } as DetailedGeneratedWorkflow);
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as ProductInput;

    const apiKey =
      input.apiKey?.trim() ||
      (input as ProductInput & { openaiKey?: string }).openaiKey?.trim() ||
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Add your OpenAI API key or configure OPENAI_API_KEY in .env.local",
        },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are Luma, a prompt-to-workflow orchestration engine for human + AI teams.

Luma turns one user goal into a detailed workflow.

For marketing/product launch workflows, Luma must create a 7-day execution system for getting the user's first 100 users, not short advice.

Core behavior:
- Learn the product and goal.
- Define the first 100 users strategy.
- Find best platforms and customer segments.
- Decide what AI can do.
- Decide what humans must approve.
- Create detailed platform content.
- Create daily social, community, Product Hunt, and outreach drafts.
- Route repetitive tasks to AI.
- Route sensitive/public/final decisions to humans.
- Track everything through trace events.
- Do not claim live scraping unless an API is connected. Use phrases like "Suggested search targets", "Potential customer segments", "People to look for", and "Search keywords".

Return only valid JSON.
No markdown.
No text outside JSON.

Return this exact JSON shape:
{
  "product_brain": {
    "summary": "",
    "positioning": "",
    "best_channels": [],
    "core_audience": []
  },
  "workflow": [
    {
      "id": "1",
      "title": "",
      "description": "",
      "owner": "ai",
      "agent": "",
      "status": "ready",
      "app": "",
      "icon": "bot",
      "x": 10,
      "y": 20,
      "layoutGroup": "strategy",
      "colorTone": "ai",
      "action_type": "generate",
      "requires_approval": false,
      "detailed_plan": [],
      "execution_button_label": "",
      "hover_summary": "",
      "expanded_details": [],
      "outputs": [],
      "human_role": "",
      "ai_role": "",
      "tools_needed": [],
      "next_action": ""
    }
  ],
  "flow_nodes": [],
  "daily_plan": [
    {
      "day": 1,
      "daily_goal": "",
      "platforms": [],
      "x_posts": [],
      "linkedin_post": "",
      "reddit_community_action": "",
      "cold_outreach_task": "",
      "expected_output": "",
      "human_approval_needed": true
    }
  ],
  "customer_discovery": [
    {
      "segment": "",
      "where_to_find": [],
      "linkedin_search_keywords": [],
      "x_search_keywords": [],
      "reddit_communities": [],
      "product_hunt_audiences": [],
      "founder_communities": []
    }
  ],
  "execution_points": [
    {
      "id": "",
      "title": "",
      "what_ai_will_do": "",
      "platform": "",
      "requires_approval": true,
      "output_preview": ""
    }
  ],
  "platform_content": [
    {
      "platform": "",
      "content_type": "",
      "draft": "",
      "owner": "",
      "tool": ""
    }
  ],
  "human_tasks": [
    {
      "title": "",
      "reason": ""
    }
  ],
  "ai_tasks": [
    {
      "title": "",
      "tool": ""
    }
  ],
  "trace": []
}

Workflow rules:
- Generate exactly 9 workflow nodes.
- Put the same 9 nodes in workflow and flow_nodes.
- Each flow node must include x/y positions for a graph layout across a 0-100 board.
- Each node must be detailed enough for hover and click expansion.
- Each node description should be short, but hover_summary and expanded_details must explain the full step.
- owner must be only "ai", "human", or "system".
- status must be "ready", "waiting", "running", or "complete".
- icon must be one of:
brain, search, mail, message, briefcase, users, userCheck, calendar, activity, bot, check, rocket.

Each workflow node must include:
- hover_summary: 2 to 3 detailed sentences for hover preview.
- expanded_details: 5 to 8 practical bullets explaining exactly what happens.
- outputs: concrete deliverables this step creates.
- human_role: what humans approve, decide, review, or manually execute.
- ai_role: what Luma or AI agents generate, automate, or track.
- tools_needed: apps/platforms used in this step.
- next_action: a strong button label like "Generate launch strategy" or "Create content".

For first-100-users marketing workflows, include these exact stages:
1. Learn product from prompt / Slack context
2. Define first 100 users strategy
3. Find best platforms and customer segments
4. Generate daily marketing content
5. Find important people/customers from X, LinkedIn, Reddit, communities
6. Create cold outreach emails
7. Ask human approval
8. Schedule / save drafts
9. Track growth and update strategy

Daily plan requirements:
- Generate exactly 7 daily_plan items.
- For each day include daily goal, platforms to use, 2 X/Twitter posts, 1 LinkedIn post, Reddit/community action, cold outreach task, expected output, and whether human approval is needed.
- X posts must total 14 across the week.
- LinkedIn posts must total 7 across the week.
- Reddit/community actions must be feedback-style and useful, not spam.
- Email tasks must be cold outreach drafts for potential customers.

Customer discovery requirements:
- Create ideal customers/personas and where to find them.
- Include LinkedIn search keywords, X search keywords, Reddit communities, Product Hunt similar product audiences, and founder communities.
- Do not present these as scraped live data.

Execution point requirements:
- Include action cards such as:
  "I will create 2 X posts for Day 1"
  "I will create 1 LinkedIn founder story post"
  "I will find customer profiles from LinkedIn, X, and Reddit"
  "I will create cold email drafts"
  "I will prepare Product Hunt launch copy"
  "I will track replies, approvals, and growth"
- Public posts and emails must require human approval first.

Quality rules:
- Be specific to the user’s product.
- Make output feel like a real first-100-users operating plan from A to Z.
- Do not produce generic advice.
- Platform content must contain usable draft text, not placeholders.
- Every platform_content draft must be 100 words or fewer.
- X, LinkedIn, and Reddit posts must be concise and ready to review without exceeding 100 words.
`;

    const userPrompt = `
Create a detailed human + AI workflow for this user request.

Product / workflow context:
- Product name: ${input.productName || "Not provided"}
- Product description: ${input.description || "Not provided"}
- Target audience: ${input.targetAudience || "Not provided"}
- Current stage: ${input.currentStage || "Not provided"}
- Requested workflow/action: ${input.desiredWorkflow || "Not provided"}
- Success goal: ${input.launchGoal || "Not provided"}
- Brand tone: ${input.tone || "Not provided"}
- Team size: ${input.teamSize || "Not provided"}
- Team positions: ${input.teamRoles || "Not provided"}
- Preferred AI agents: ${input.aiAgents || "Not provided"}
- Preferred platforms/tools: ${input.tools || "Not provided"}

If the request is about marketing, launch, product distribution, outreach, Product Hunt, social content, Reddit, X, LinkedIn, email, or getting first users:
Generate the full 7-day first-100-users workflow.

Make sure the workflow explains:
- what Luma does automatically
- what humans approve
- where the user should look for potential customers
- what content gets created for X, LinkedIn, Reddit, Product Hunt, Email, and communities
- when things should be saved as drafts or scheduled
- how emails are sent
- how results are tracked
- how memory improves future workflows

The first node should be "Learn Product Context".
The second node should be "Define First 100 Users Strategy".
The third node should be "Find Platforms and Segments".
`;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        temperature: 0.45,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "OpenAI request failed",
          detail: errorText,
          fallback: buildFallback(input),
        },
        { status: 502 }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        {
          error: "OpenAI returned no content",
          fallback: buildFallback(input),
        },
        { status: 502 }
      );
    }

    try {
      const jsonText = extractJson(content);
      const parsed = JSON.parse(jsonText) as DetailedGeneratedWorkflow;
      return NextResponse.json(normalizeWorkflow(parsed));
    } catch (error) {
      return NextResponse.json(
        {
          error: "OpenAI returned invalid JSON",
          detail: error instanceof Error ? error.message : "Unknown parse error",
          fallback: buildFallback(input),
        },
        { status: 502 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Workflow generation failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 
