import { NextResponse } from "next/server";
import type {
  GeneratedWorkflow,
  ProductInput,
  WorkflowNodeData,
} from "@/components/dashboard/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

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

function normalizeWorkflow(data: DetailedGeneratedWorkflow): DetailedGeneratedWorkflow {
  const workflow = Array.isArray(data.workflow) ? data.workflow.slice(0, 9) : [];
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

    workflow: workflow.map((node, index): DetailedWorkflowNodeData => ({
      id: String(node.id ?? index + 1),
      title: node.title ?? `Workflow task ${index + 1}`,
      description:
        node.description ??
        "A concrete step in the human + AI marketing workflow.",
      owner:
        node.owner === "human" || node.owner === "system"
          ? node.owner
          : "ai",
      agent: node.agent ?? "Luma Agent",
      status: node.status ?? "ready",
      app: node.app ?? "Luma",
      icon: node.icon ?? "bot",

      hover_summary:
        node.hover_summary ??
        "Luma explains what happens in this step, what AI will do, and where human approval is needed.",

      expanded_details: toStringArray(node.expanded_details).length
        ? toStringArray(node.expanded_details)
        : [
            "Understand the current launch context.",
            "Create practical outputs for this workflow stage.",
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

      next_action: node.next_action ?? "Run this step",
    })),

    platform_content: platformContent.map((item) => ({
      platform: item.platform ?? "Platform",
      content_type: item.content_type ?? "Content draft",
      draft: item.draft ?? "",
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

  return normalizeWorkflow({
    product_brain: {
      summary: `${productName} is ready for a structured launch workflow. Luma will turn the product context into launch strategy, content, approvals, scheduling, outreach, and tracking.`,
      positioning: `${productName} should be positioned around one clear pain point, one specific audience, and one strong outcome. The launch should explain why the product matters now, who it helps, and what users can do after trying it.`,
      best_channels: [
        "Product Hunt — best for public launch discovery and early builder attention",
        "X/Twitter — best for founder-led storytelling, launch threads, and real-time updates",
        "LinkedIn — best for professional credibility and SaaS/product storytelling",
        "Reddit — best for feedback-driven community discovery without sounding like an ad",
        "Email — best for direct outreach to expected customers and early supporters",
      ],
      core_audience: [
        input.targetAudience || "early adopters who already feel the problem",
        "builders, founders, and users already searching for a better workflow",
        "people active in communities around this product category",
      ],
    },

    workflow: [
      {
        id: "1",
        title: "Define Launch Strategy",
        description:
          "Luma creates the launch angle, Product Hunt plan, required assets, and channel strategy.",
        owner: "ai",
        agent: "Luma Strategy Agent",
        status: "ready",
        app: "Luma",
        icon: "rocket",
        hover_summary:
          "Luma studies the product, audience, launch goal, and category to build the full launch direction. It defines the Product Hunt angle, the launch assets, and the first channels the product should use.",
        expanded_details: [
          "Create the core positioning: who the product is for, what problem it solves, and why users should care now.",
          "Generate Product Hunt launch requirements: tagline, description, maker comment, feature bullets, and supporter outreach plan.",
          "Create a launch asset checklist: 3 screenshots, 1 short demo video, landing page CTA, and proof/value screenshot.",
          "Define what the demo video should include: problem, product walkthrough, key feature, outcome, and CTA.",
          "Recommend the best launch channels based on the product type, target audience, and goal.",
          "Create a day-before-launch checklist so the team knows exactly what must be ready.",
          "Prepare the content so the user can move into a dedicated content creation page after generation.",
        ],
        outputs: [
          "Launch strategy",
          "Product Hunt plan",
          "Screenshot checklist",
          "Demo video script",
          "Channel strategy",
        ],
        human_role:
          "Founder approves the final positioning, launch promise, and Product Hunt angle before content is generated.",
        ai_role:
          "Luma automatically generates the strategy, launch checklist, Product Hunt brief, screenshot plan, and demo video outline.",
        tools_needed: ["Luma", "Product Hunt", "Screen Studio", "Canva"],
        next_action: "Generate launch strategy",
      },
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
          "Luma turns the approved launch strategy into content for the best SaaS launch platforms. It writes separate posts for Product Hunt, X, LinkedIn, Reddit, and Email so the message feels native on each channel instead of copied everywhere.",
        expanded_details: [
          "Create Product Hunt tagline, description, maker comment, and feature bullets.",
          "Create an X launch post, build-in-public thread, and follow-up posts.",
          "Create a LinkedIn founder story post and a professional problem-solution post.",
          "Create Reddit posts written as feedback requests, not spammy promotions.",
          "Create cold email and early-user invite email drafts.",
          "Suggest which screenshots or product visuals should be attached to each post.",
        ],
        outputs: [
          "Product Hunt copy",
          "X launch thread",
          "LinkedIn launch post",
          "Reddit community draft",
          "Cold email draft",
        ],
        human_role:
          "Founder reviews the generated content and confirms it matches the brand voice and public promise.",
        ai_role:
          "Luma writes the first complete version of every post, email, and launch description.",
        tools_needed: ["Product Hunt", "X", "LinkedIn", "Reddit", "Email"],
        next_action: "Generate content",
      },
      {
        id: "3",
        title: "Review Marketing Content",
        description:
          "Human reviews the message for clarity, accuracy, tone, and public risk.",
        owner: "human",
        agent: "Founder Review",
        status: "waiting",
        app: "Luma",
        icon: "userCheck",
        hover_summary:
          "This step keeps humans in control of public messaging. Luma can suggest improvements, but a human must approve the final Product Hunt copy, social posts, and emails before anything goes live.",
        expanded_details: [
          "Check if the positioning is accurate and not overpromising.",
          "Check if the Product Hunt copy is clear in the first few seconds and uses direct language.",
          "Check if Reddit posts sound like a genuine feedback request instead of an advertisement.",
          "Check if cold emails feel personal, relevant, and appropriate for the recipient.",
          "Check if each post has a clear call-to-action, the right asset attached, and the right platform fit.",
          "Approve, edit, or regenerate any piece of content before scheduling.",
        ],
        outputs: [
          "Approved positioning",
          "Approved social posts",
          "Approved email copy",
          "Approved Product Hunt copy",
        ],
        human_role:
          "Founder or marketing teammate approves, edits, or rejects final content before it is used.",
        ai_role:
          "Luma highlights weak CTAs, spam risk, unclear positioning, and platform mismatch.",
        tools_needed: ["Luma"],
        next_action: "Review content",
      },
      {
        id: "4",
        title: "Schedule Social Posts",
        description:
          "AI prepares launch posts as drafts and schedules them after human approval.",
        owner: "ai",
        agent: "Social Scheduling Agent",
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
          "24-hour posting schedule",
          "Drafted posts",
          "Post timing plan",
          "Approval status",
        ],
        human_role:
          "Human verifies final public posts and confirms whether Luma can schedule or save them as drafts.",
        ai_role:
          "Luma organizes timing, creates drafts, suggests best posting order, and updates post status.",
        tools_needed: ["X", "LinkedIn", "Luma"],
        next_action: "Schedule approved posts",
      },
      {
        id: "5",
        title: "Send Outreach Emails",
        description:
          "AI writes and sends approved outreach emails to expected customers.",
        owner: "ai",
        agent: "Email Agent",
        status: "ready",
        app: "Resend",
        icon: "mail",
        hover_summary:
          "Luma creates outreach emails for expected customers, early supporters, and relevant users. It prepares subject lines, follow-ups, and recipient logic, but nothing is sent until a human approves the final version.",
        expanded_details: [
          "Define expected customer segments based on the product, audience, and launch goal.",
          "Create cold email drafts for early beta users, expected customers, and warm contacts.",
          "Create subject lines and follow-up versions.",
          "Ask the human to approve the final email, recipients, and timing before sending.",
          "Send approved emails through the connected email integration only after approval.",
          "Track sent, pending, replied, and follow-up status so outreach stays organized.",
        ],
        outputs: [
          "Cold email draft",
          "Follow-up email",
          "Expected customer list brief",
          "Sent email status",
        ],
        human_role:
          "Human approves the final email message, target group, and send action before Luma sends anything.",
        ai_role:
          "Luma writes email drafts, creates follow-ups, prepares recipient strategy, and sends approved emails through Resend.",
        tools_needed: ["Resend", "Email", "Luma"],
        next_action: "Prepare outreach email",
      },
      {
        id: "6",
        title: "Prepare Community Posts",
        description:
          "AI drafts community posts and humans decide where they should be posted.",
        owner: "ai",
        agent: "Community Agent",
        status: "ready",
        app: "Reddit",
        icon: "users",
        hover_summary:
          "Luma creates Reddit and community posts that ask for feedback instead of sounding promotional. Humans choose the final communities because community posting needs judgment.",
        expanded_details: [
          "Suggest relevant subreddits and communities for the product category.",
          "Create feedback-style Reddit post drafts.",
          "Create different versions for builders, SaaS users, students, or founders depending on the product.",
          "Explain which communities are risky or likely to reject promotional posts.",
          "Let the human approve or copy the post manually.",
          "Track community posts as drafted, approved, ready, or posted.",
        ],
        outputs: [
          "Reddit post draft",
          "Community list",
          "Feedback request angle",
          "Posting risk notes",
        ],
        human_role:
          "Human chooses the final communities and approves the post to avoid spammy or off-topic posting.",
        ai_role:
          "Luma drafts posts, suggests communities, rewrites for tone, and prepares copy-ready content.",
        tools_needed: ["Reddit", "Indie Hackers", "Discord", "Luma"],
        next_action: "Draft community posts",
      },
      {
        id: "7",
        title: "Create Launch Calendar",
        description:
          "AI creates a clear launch-day and follow-up action plan.",
        owner: "ai",
        agent: "Planner Agent",
        status: "ready",
        app: "Calendar",
        icon: "calendar",
        hover_summary:
          "Luma turns the whole strategy into a timeline so the team knows what to do before launch, during launch, and after launch.",
        expanded_details: [
          "Create a day-before-launch checklist.",
          "Create an hour-by-hour launch-day schedule.",
          "Create a 7-day post-launch follow-up plan.",
          "Assign tasks to AI agents and human teammates.",
          "Mark approval gates before public actions.",
          "Add reminders for follow-ups, reposts, and outreach replies.",
        ],
        outputs: [
          "Launch-day schedule",
          "7-day follow-up plan",
          "Task ownership map",
          "Reminder list",
        ],
        human_role:
          "Team confirms the schedule, ownership, and final launch readiness.",
        ai_role:
          "Luma organizes all tasks into a sequence and updates the workflow status.",
        tools_needed: ["Calendar", "Luma"],
        next_action: "Create launch calendar",
      },
      {
        id: "8",
        title: "Track Results",
        description:
          "AI tracks campaign progress, replies, approvals, and pending work.",
        owner: "system",
        agent: "Tracker Agent",
        status: "ready",
        app: "Luma",
        icon: "activity",
        hover_summary:
          "Luma tracks what has been generated, approved, sent, posted, or left pending. This gives the user a traceable launch system instead of scattered tasks.",
        expanded_details: [
          "Track which content has been generated.",
          "Track which content needs human approval.",
          "Track sent emails and pending follow-ups.",
          "Track social posts as drafted, approved, scheduled, or published.",
          "Track Reddit/community posts as ready or manually posted.",
          "Summarize what worked and what should be improved next.",
        ],
        outputs: [
          "Trace timeline",
          "Launch status",
          "Pending task list",
          "Follow-up list",
        ],
        human_role:
          "Human reviews results and decides what should be repeated or changed.",
        ai_role:
          "Luma summarizes progress, detects pending work, and recommends next actions.",
        tools_needed: ["Luma", "Email", "Social platforms"],
        next_action: "Track launch progress",
      },
      {
        id: "9",
        title: "Memory Update",
        description:
          "Luma saves approved decisions and winning messages for future workflows.",
        owner: "system",
        agent: "Memory Agent",
        status: "ready",
        app: "Luma",
        icon: "brain",
        hover_summary:
          "After the workflow runs, Luma saves what humans approved and what messaging worked. Future workflows become faster because the product memory improves.",
        expanded_details: [
          "Save approved positioning.",
          "Save approved audience and platform choices.",
          "Save best-performing post and email angles.",
          "Save rejected or risky messaging so it is not repeated.",
          "Save workflow history for future launches.",
          "Use memory to make future content more accurate.",
        ],
        outputs: [
          "Product memory",
          "Approved messaging",
          "Launch history",
          "Reusable workflow context",
        ],
        human_role:
          "Human confirms which decisions should become product memory.",
        ai_role:
          "Luma stores approved decisions and uses them for the next workflow.",
        tools_needed: ["Luma Memory"],
        next_action: "Update memory",
      },
    ],

    platform_content: [
      {
        platform: "Product Hunt",
        content_type: "Launch page brief",
        draft: `Tagline: ${productName} helps ${input.targetAudience || "busy teams"} turn messy work into a clear AI + human workflow.\n\nDescription: ${productName} gives teams a simple way to plan, assign, approve, and track launch work across AI agents and humans. Instead of scattered prompts, tasks, and tools, everything becomes one traceable workflow.\n\nMaker comment angle: We built this because teams do not need more AI suggestions — they need AI that knows what to do, what humans should approve, and how to keep work moving.`,
        owner: "AI drafts, founder approves",
        tool: "Product Hunt",
      },
      {
        platform: "X",
        content_type: "Launch post",
        draft: `Launching ${productName} tomorrow 🚀\n\nThe idea is simple:\nAI should not just answer questions.\nIt should help route work.\n\n${productName} turns a goal into a workflow, assigns repetitive tasks to AI, keeps humans in control for approvals, and tracks every step.\n\nLooking for early feedback.`,
        owner: "AI drafts, founder approves",
        tool: "X",
      },
      {
        platform: "LinkedIn",
        content_type: "Founder launch story",
        draft: `Building products is easier than ever, but executing the work around them is still messy.\n\nThat is why we built ${productName}: a human + AI workflow system that breaks a goal into tasks, assigns repeatable work to AI agents, routes decisions to people, and tracks progress from start to finish.\n\nWe are opening early access and looking for feedback from ${input.targetAudience || "founders, builders, and small teams"}.`,
        owner: "AI drafts, founder approves",
        tool: "LinkedIn",
      },
      {
        platform: "Reddit",
        content_type: "Community feedback post",
        draft: `Hey everyone,\n\nI’m building ${productName}, a tool that turns a goal into a human + AI workflow. The idea is that AI handles repetitive work like drafting, research, planning, and tracking, while humans approve the important decisions.\n\nI’m trying to understand if this is useful for ${input.targetAudience || "small teams and builders"}.\n\nWould you use something like this? What workflow would you want AI to route for you?`,
        owner: "AI drafts, human posts manually",
        tool: "Reddit",
      },
      {
        platform: "Email",
        content_type: "Cold outreach email",
        draft: `Subject: Quick feedback on ${productName}?\n\nHey [Name],\n\nI’m building ${productName}, a workflow system that routes tasks between AI agents and humans.\n\nIt helps ${input.targetAudience || "teams and founders"} turn messy goals into clear workflows where AI handles repetitive work and humans approve the important decisions.\n\nWould you be open to taking a quick look and sharing feedback?`,
        owner: "AI drafts, human approves, Resend sends",
        tool: "Resend",
      },
    ],

    human_tasks: [
      {
        title: "Approve launch positioning",
        reason:
          "The launch promise affects Product Hunt, social posts, emails, and community posts.",
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
        title: "Generate launch strategy and Product Hunt plan",
        tool: "Luma Strategy Agent",
      },
      {
        title: "Create platform-specific marketing content",
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
      "Luma learned the product and launch goal",
      "Launch strategy and channel plan created",
      "AI tasks routed to Luma agents",
      "Human approvals added for public-risk decisions",
      "Platform-specific content drafts prepared",
      "Outreach and scheduling workflow created",
      "Tracking and memory update steps added",
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

For marketing/product launch workflows, Luma must create an A-to-Z launch execution system, not short advice.

Core behavior:
- Learn the product and goal.
- Define the launch strategy.
- Decide what AI can do.
- Decide what humans must approve.
- Create detailed platform content.
- Explain required assets like screenshots, demo video, launch page copy, and outreach.
- Route repetitive tasks to AI.
- Route sensitive/public/final decisions to humans.
- Track everything through trace events.

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
      "hover_summary": "",
      "expanded_details": [],
      "outputs": [],
      "human_role": "",
      "ai_role": "",
      "tools_needed": [],
      "next_action": ""
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

For product launch and marketing workflows, include these stages:
1. Define Launch Strategy
2. Create Marketing Content
3. Review Marketing Content
4. Schedule Social Posts
5. Send Outreach Emails
6. Prepare Community Posts
7. Create Launch Calendar
8. Track Results
9. Memory Update

Detailed requirements for launch workflows:
- Define Launch Strategy must include Product Hunt launch requirements:
  3 product screenshots, 1 demo video, tagline, description, maker comment, launch checklist, supporter outreach plan.
- Create Marketing Content must explain content creation for Product Hunt, X/Twitter, LinkedIn, Reddit, and Email.
- Create Marketing Content must be detailed enough to explain the 5 best SaaS marketing channels, the asset used with each post, and how the user moves into content creation after strategy generation.
- Review Marketing Content must include human checks for positioning, clarity, tone, spam risk, brand safety, and public post quality.
- Schedule Social Posts must explain that AI can save drafts and schedule only after human approval.
- Send Outreach Emails must explain that AI drafts emails and sends through integration only after human approval.
- Prepare Community Posts must explain that Reddit/community content should be feedback-first and human-approved.
- Track Results must explain tracking approvals, sent emails, posts, follow-ups, and pending work.
- Memory Update must explain saving approved decisions for future workflows.

Quality rules:
- Be specific to the user’s product.
- Make output feel like a real launch operating plan from A to Z.
- Do not produce generic advice.
- Platform content must contain usable draft text, not placeholders.
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
Generate the full A-to-Z launch workflow.

Make sure the workflow explains:
- what Luma does automatically
- what humans approve
- what assets are needed
- where the user should post
- what content gets created
- when things should be scheduled
- how emails are sent
- how results are tracked
- how memory improves future workflows

The first node should be "Define Launch Strategy".
The second node should be "Create Marketing Content".
The third node should be "Review Marketing Content".
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
