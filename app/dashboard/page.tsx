"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Copy,
  Loader2,
  Play,
  Save,
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

type LocalExecutionStatus = "pending" | "running" | "waiting_approval" | "approved" | "completed";

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

function makeFirst100FallbackWorkflow(prompt: string): GeneratedWorkflow {
  const productName = "User product";
  const nodes: WorkflowNodeData[] = [
    { id: "learn-product", title: "Learn Product Context", description: "Read the product prompt and connected Slack context before planning.", owner: "ai", agent: "Product Brain Agent", status: "ready", app: "Slack + Luma", icon: "brain", x: 5, y: 35, colorTone: "ai", action_type: "generate", requires_approval: false, execution_button_label: "Generate product brain", hover_summary: "Luma extracts the product, audience, pain, promise, and assumptions before generating public content.", expanded_details: ["Summarize the product and target user.", "Use Slack context only if connected.", "Identify assumptions for review.", "Prepare reusable product memory."], outputs: ["Product brain", "Audience assumptions"], human_role: "Confirm assumptions.", ai_role: "Learn and structure context.", tools_needed: ["Luma", "Slack"], next_action: "Generate product brain" },
    { id: "first-100", title: "Define First 100 Users Strategy", description: "Create a real 7-day execution plan to get the first 100 users.", owner: "ai", agent: "Growth Strategy Agent", status: "ready", app: "Luma", icon: "rocket", x: 30, y: 12, colorTone: "ai", action_type: "generate", requires_approval: false, execution_button_label: "Generate strategy", hover_summary: "Luma turns the prompt into daily acquisition goals, platform choices, content work, outreach work, and approval gates.", expanded_details: ["Set daily growth goals.", "Choose first channels.", "Define expected outputs.", "Add tracking checkpoints."], outputs: ["7-day plan", "Daily goals"], human_role: "Approve the strategy direction.", ai_role: "Plan the execution system.", tools_needed: ["Luma"], next_action: "Generate strategy" },
    { id: "platforms", title: "Find Platforms and Segments", description: "Suggest customer segments and where to find them.", owner: "ai", agent: "Discovery Agent", status: "ready", app: "LinkedIn + X + Reddit", icon: "search", x: 58, y: 18, colorTone: "platform", action_type: "generate", requires_approval: false, execution_button_label: "Find targets", hover_summary: "Luma creates suggested search targets, potential customer segments, people to look for, and search keywords without claiming live scraping.", expanded_details: ["Create ideal customer profiles.", "Suggest LinkedIn and X keywords.", "Suggest Reddit communities.", "Map Product Hunt similar audiences."], outputs: ["Search targets", "Customer segments"], human_role: "Pick the strongest segment.", ai_role: "Generate discovery targets.", tools_needed: ["LinkedIn", "X", "Reddit"], next_action: "Find targets" },
    { id: "daily-content", title: "Generate Daily Marketing Content", description: "Generate 14 X posts, 7 LinkedIn posts, Reddit actions, Product Hunt copy, and email angles.", owner: "ai", agent: "Content Agent", status: "ready", app: "X + LinkedIn + Reddit", icon: "message", x: 27, y: 50, colorTone: "ai", action_type: "generate", requires_approval: true, execution_button_label: "Generate content", hover_summary: "Luma creates platform-native drafts for all seven days. Public content stays in draft until a human approves it.", expanded_details: ["Write 2 X posts per day.", "Write 1 LinkedIn post per day.", "Create feedback-first Reddit actions.", "Prepare Product Hunt and community copy."], outputs: ["14 X drafts", "7 LinkedIn drafts", "Community actions"], human_role: "Review tone, claims, and spam risk.", ai_role: "Create all daily drafts.", tools_needed: ["X", "LinkedIn", "Reddit", "Product Hunt"], next_action: "Generate content" },
    { id: "people", title: "Find Important People", description: "Create search lists for customers and communities to look at.", owner: "ai", agent: "Customer Discovery Agent", status: "ready", app: "X + LinkedIn + Reddit", icon: "users", x: 75, y: 45, colorTone: "platform", action_type: "generate", requires_approval: false, execution_button_label: "Generate search list", hover_summary: "The output is a practical map of people to look for, keywords, communities, and similar-product audiences.", expanded_details: ["List roles and buying signals.", "Suggest X and LinkedIn keywords.", "Suggest Reddit threads.", "Suggest founder communities."], outputs: ["People to look for", "Search keywords"], human_role: "Validate target fit.", ai_role: "Create search-ready targets.", tools_needed: ["LinkedIn", "X", "Reddit", "Product Hunt"], next_action: "Generate search list" },
    { id: "emails", title: "Create Cold Outreach Emails", description: "Create cold email and follow-up drafts for potential customers.", owner: "ai", agent: "Email Agent", status: "ready", app: "Email", icon: "mail", x: 52, y: 72, colorTone: "ai", action_type: "generate", requires_approval: true, execution_button_label: "Generate emails", hover_summary: "Luma writes concise outreach drafts and follow-ups. Emails are never sent without human approval.", expanded_details: ["Write persona-specific cold emails.", "Write follow-ups.", "Keep asks low-friction.", "Save drafts for approval."], outputs: ["Cold emails", "Follow-ups"], human_role: "Approve recipients and copy.", ai_role: "Draft outreach.", tools_needed: ["Email", "Resend"], next_action: "Generate emails" },
    { id: "approval", title: "Ask Human Approval", description: "Humans approve all public posts and emails before they are used.", owner: "human", agent: "Founder Review", status: "waiting", app: "Luma", icon: "userCheck", x: 80, y: 75, colorTone: "human", action_type: "approve", requires_approval: true, execution_button_label: "Approve drafts", hover_summary: "Luma plans the strategy, does the repeatable work, and only asks humans for approval.", expanded_details: ["Review posts.", "Review emails.", "Check Reddit tone.", "Approve or request edits."], outputs: ["Approval queue"], human_role: "Approve, edit, or reject.", ai_role: "Prepare review queue.", tools_needed: ["Luma"], next_action: "Approve drafts" },
    { id: "drafts", title: "Schedule / Save Drafts", description: "Save approved content as drafts and schedule only after approval.", owner: "system", agent: "Draft Operations Agent", status: "ready", app: "Calendar + Drafts", icon: "calendar", x: 25, y: 84, colorTone: "system", action_type: "save_draft", requires_approval: true, execution_button_label: "Save drafts", hover_summary: "Approved outputs can be saved as drafts or scheduled. Luma does not auto-post publicly.", expanded_details: ["Save approved drafts.", "Create the schedule.", "Keep unapproved work waiting.", "Update statuses."], outputs: ["Draft queue", "Schedule"], human_role: "Approve scheduling.", ai_role: "Organize drafts.", tools_needed: ["Calendar", "Social platforms"], next_action: "Save drafts" },
    { id: "growth", title: "Track Growth and Update Strategy", description: "Track replies, approvals, and first-100-users progress.", owner: "system", agent: "Growth Tracker", status: "ready", app: "Luma", icon: "activity", x: 6, y: 68, colorTone: "system", action_type: "track", requires_approval: false, execution_button_label: "Track growth", hover_summary: "Luma tracks output volume, approvals, replies, and first-100-users progress, then recommends daily updates.", expanded_details: ["Track generated drafts.", "Track approvals.", "Track replies and interested users.", "Update the strategy."], outputs: ["Growth tracker", "Updated strategy"], human_role: "Decide what to repeat.", ai_role: "Track and recommend updates.", tools_needed: ["Luma", "Slack", "Email"], next_action: "Track growth" },
  ];

  return {
    product_brain: {
      summary: prompt || "Luma will learn the product and create a first-100-users workflow.",
      positioning: "From one product prompt to a 7-day execution plan for your first 100 users.",
      best_channels: ["X/Twitter", "LinkedIn", "Reddit", "Product Hunt", "Email", "Slack / communities"],
      core_audience: ["Potential early customers", "People already discussing the problem", "Users of similar products"],
    },
    workflow: nodes,
    flow_nodes: nodes,
    daily_plan: Array.from({ length: 7 }, (_, index) => ({
      day: index + 1,
      daily_goal: `Day ${index + 1}: create conversations and move interested people toward feedback or early access.`,
      platforms: ["X/Twitter", "LinkedIn", "Reddit", "Email", index > 3 ? "Product Hunt" : "Communities"],
      x_posts: [
        `Day ${index + 1}: sharing what I am learning while building ${productName}. The goal is to find people who feel this problem now and want a better workflow.`,
        `Day ${index + 1}: first-100-users loop: publish, reply, ask for feedback, send useful outreach, track signals, improve the message.`,
      ],
      linkedin_post: `Day ${index + 1}: I am focusing on conversations over impressions while building ${productName}. The goal is to learn who has the problem and what would make them try it this week.`,
      reddit_community_action: "Ask a feedback-first question or reply helpfully to existing problem threads. Do not post promotional copy.",
      cold_outreach_task: "Send 10 personalized feedback requests to suggested customer segments.",
      expected_output: "Drafts generated, approvals queued, replies tracked, and strategy notes updated.",
      human_approval_needed: true,
    })),
    customer_discovery: [
      {
        segment: "Potential early customers",
        where_to_find: ["LinkedIn role searches", "X keyword searches", "Reddit problem threads", "Product Hunt similar products", "Founder communities"],
        linkedin_search_keywords: ["founder operations", "growth marketing", "manual workflow", "looking for tool"],
        x_search_keywords: ["looking for a tool", "manual workflow", "need a better way", "feedback request"],
        reddit_communities: ["r/SaaS", "r/startups", "r/Entrepreneur", "category-specific communities"],
        product_hunt_audiences: ["Users of similar products", "Makers who upvote SaaS and productivity tools"],
        founder_communities: ["Indie Hackers", "YC Startup School", "Slack founder groups", "newsletter communities"],
      },
    ],
    execution_points: [
      { id: "x-day-1", title: "Create Day 1 X posts", what_ai_will_do: "I will create 2 X posts for Day 1", platform: "X", requires_approval: true, output_preview: "Two X drafts for human review." },
      { id: "linkedin-founder", title: "Create LinkedIn founder story", what_ai_will_do: "I will create 1 LinkedIn founder story post", platform: "LinkedIn", requires_approval: true, output_preview: "One LinkedIn draft for human review." },
      { id: "profiles", title: "Find customer profiles", what_ai_will_do: "I will find customer profiles from LinkedIn, X, and Reddit", platform: "Discovery", requires_approval: false, output_preview: "Suggested search targets and keywords." },
      { id: "emails", title: "Create cold email drafts", what_ai_will_do: "I will create cold email drafts", platform: "Email", requires_approval: true, output_preview: "Cold email drafts for approval." },
      { id: "product-hunt", title: "Prepare Product Hunt launch copy", what_ai_will_do: "I will prepare Product Hunt launch copy", platform: "Product Hunt", requires_approval: true, output_preview: "Tagline, description, and maker comment." },
      { id: "tracking", title: "Track growth", what_ai_will_do: "I will track replies, approvals, and growth", platform: "Luma", requires_approval: false, output_preview: "Status and first-100-users progress." },
    ],
    platform_content: [
      { platform: "X", content_type: "Post set", draft: "Two daily posts that share progress, ask for feedback, and invite early users to reply.", owner: "AI draft, human approve", tool: "X" },
      { platform: "LinkedIn", content_type: "Founder story", draft: "A professional founder-led update about the problem, the learning loop, and the first-100-users goal.", owner: "AI draft, human approve", tool: "LinkedIn" },
      { platform: "Reddit", content_type: "Feedback prompt", draft: "A feedback-first community question that avoids promotional language and asks about the current workflow pain.", owner: "AI draft, human post", tool: "Reddit" },
      { platform: "Email", content_type: "Cold outreach", draft: "A short personal email asking for feedback from people who match the suggested customer segment.", owner: "AI draft, human approve", tool: "Email" },
    ],
    human_tasks: [{ title: "Approve public content", reason: "Posts and emails should be reviewed before they are used." }],
    ai_tasks: [{ title: "Generate 7-day execution plan", tool: "Luma" }, { title: "Create social and outreach drafts", tool: "Luma" }],
    trace: ["Product prompt learned", "First-100-users plan generated", "Drafts prepared", "Approval gates added", "Tracking ready"],
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

const flowConnections = [
  ["learn-product", "first-100"],
  ["first-100", "platforms"],
  ["platforms", "people"],
  ["first-100", "daily-content"],
  ["daily-content", "emails"],
  ["people", "emails"],
  ["emails", "approval"],
  ["approval", "drafts"],
  ["drafts", "growth"],
  ["growth", "learn-product"],
];

function nodeTone(node: WorkflowNodeData) {
  if (node.colorTone === "human" || node.owner === "human") {
    return {
      card: "border-[#e8dcc8] bg-[#fbf7ef]",
      icon: "bg-[#efe6d8] text-[#7c5f3b]",
      badge: "bg-[#efe6d8] text-[#7c5f3b]",
      glow: "hover:border-[#d6b98d] hover:shadow-[0_18px_46px_rgba(124,95,59,0.14)]",
    };
  }

  if (node.colorTone === "platform" || /X|LinkedIn|Reddit|Product Hunt/i.test(node.app)) {
    return {
      card: "border-[#c8e7df] bg-[#f0fbf8]",
      icon: "bg-[#d9f5ee] text-[#0f766e]",
      badge: "bg-[#dff7ef] text-[#0f766e]",
      glow: "hover:border-[#80cbbb] hover:shadow-[0_18px_46px_rgba(15,118,110,0.14)]",
    };
  }

  if (node.colorTone === "system" || node.owner === "system") {
    return {
      card: "border-[#ddd6fe] bg-[#f7f4ff]",
      icon: "bg-[#ede9fe] text-[#6d5bd0]",
      badge: "bg-[#ede9fe] text-[#6d5bd0]",
      glow: "hover:border-[#b9a9f5] hover:shadow-[0_18px_46px_rgba(109,91,208,0.14)]",
    };
  }

  return {
    card: "border-[#f6d7a8] bg-[#fff8e8]",
    icon: "bg-[#ffedc2] text-[#b45309]",
    badge: "bg-[#ffedc2] text-[#92400e]",
    glow: "hover:border-[#f0b85c] hover:shadow-[0_18px_46px_rgba(180,83,9,0.16)]",
  };
}

function FlowchartBoard({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: WorkflowNodeData[];
  selectedId?: string;
  onSelect: (node: WorkflowNodeData) => void;
}) {
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <section className="rounded-2xl border border-[#d8e0ea] bg-[#fffaf0] p-4 shadow-[0_24px_70px_rgba(18,24,38,0.10)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b45309]">Trace-style workflow</p>
          <h2 className="mt-2 text-2xl font-semibold">First 100 users flowchart</h2>
          <p className="mt-1 text-sm leading-6 text-[#526172]">Luma plans the strategy, does the repeatable work, and only asks humans for approval.</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#92400e] ring-1 ring-[#f6d365]">Draft-only until approved</span>
      </div>

      <div className="relative mt-5 min-h-[760px] overflow-hidden rounded-2xl border border-[#eadfbf] bg-[radial-gradient(#e8dcc8_1px,transparent_1px)] p-4 [background-size:22px_22px] md:min-h-[620px]">
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {flowConnections.map(([from, to]) => {
            const start = byId.get(from);
            const end = byId.get(to);
            if (!start || !end) return null;
            const x1 = (start.x ?? 10) + 8;
            const y1 = (start.y ?? 10) + 5;
            const x2 = (end.x ?? 10) + 8;
            const y2 = (end.y ?? 10) + 5;
            const midX = (x1 + x2) / 2;
            return (
              <path
                key={`${from}-${to}`}
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="#d3b985"
                strokeWidth="0.34"
                strokeDasharray="1.2 1.5"
                strokeLinecap="round"
                opacity="0.86"
              />
            );
          })}
        </svg>

        <div className="grid gap-3 md:block">
          {nodes.map((node, index) => {
            const tone = nodeTone(node);
            const isSelected = selectedId === node.id;
            return (
              <motion.button
                key={node.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                onClick={() => onSelect(node)}
                className={`group relative z-10 w-full rounded-2xl border p-4 text-left shadow-[0_10px_28px_rgba(18,24,38,0.08)] transition duration-200 hover:-translate-y-1 ${tone.card} ${tone.glow} ${
                  isSelected ? "ring-4 ring-[#facc15]/35" : ""
                } md:absolute md:w-[235px]`}
                style={{
                  left: `min(${node.x ?? 0}%, calc(100% - 245px))`,
                  top: `${node.y ?? index * 10}%`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition duration-200 group-hover:rotate-6 group-hover:scale-110 ${tone.icon}`}>
                    {node.owner === "human" ? <UserCheck className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#111827]">{node.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#526172]">{node.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${tone.badge}`}>{node.owner}</span>
                  <span className="rounded-full bg-white/75 px-2 py-1 text-[10px] font-bold text-[#526172] ring-1 ring-black/5">{node.app}</span>
                  <span className="rounded-full bg-[#111827] px-2 py-1 text-[10px] font-bold capitalize text-white">{node.status}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-lg border border-[#d8e0ea] bg-white/75 px-2.5 py-1.5 text-[11px] font-bold text-[#334155]">Show details</span>
                  <span className="rounded-lg bg-[#111827] px-2.5 py-1.5 text-[11px] font-bold text-white">{node.execution_button_label || node.next_action || "Generate"}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CommandCenter({
  workflow,
  statuses,
  onStart,
  onGenerate,
  onApprove,
  onCopy,
  onSaveDraft,
}: {
  workflow: GeneratedWorkflow;
  statuses: Record<string, LocalExecutionStatus>;
  onStart: () => void;
  onGenerate: (id: string, requiresApproval: boolean) => void;
  onApprove: (id: string) => void;
  onCopy: (text: string) => void;
  onSaveDraft: (id: string) => void;
}) {
  const points = workflow.execution_points?.length
    ? workflow.execution_points
    : workflow.workflow.slice(0, 6).map((node) => ({
        id: node.id,
        title: node.title,
        what_ai_will_do: `I will ${node.execution_button_label || node.next_action || node.title}`.replace("I will Generate", "I will generate"),
        platform: node.app,
        requires_approval: Boolean(node.requires_approval),
        output_preview: node.outputs?.[0] || node.description,
      }));

  return (
    <section className="rounded-2xl border border-[#eadfbf] bg-white/95 p-5 shadow-[0_18px_52px_rgba(18,24,38,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b45309]">Command Center</p>
          <h2 className="mt-2 text-xl font-semibold">Start execution</h2>
          <p className="mt-1 text-sm leading-6 text-[#526172]">Public posts and emails require human approval first.</p>
        </div>
        <button onClick={onStart} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">
          <Play className="h-4 w-4" />
          Start execution
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {points.map((point) => {
          const status = statuses[point.id] ?? "pending";
          return (
            <div key={point.id} className="rounded-2xl border border-[#d8e0ea] bg-[#f8fafc] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#111827]">{point.what_ai_will_do}</p>
                  <p className="mt-1 text-xs font-semibold text-[#64748b]">{point.platform} · {point.requires_approval ? "Approval required" : "No public action"}</p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold capitalize text-[#526172] ring-1 ring-[#d8e0ea]">{status.replace("_", " ")}</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#526172]">{point.output_preview}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => onGenerate(point.id, point.requires_approval)} className="rounded-lg bg-[#ffd84d] px-3 py-2 text-xs font-bold text-[#3f2d00]">Show / generate</button>
                <button onClick={() => onCopy(point.output_preview)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8e0ea] bg-white px-3 py-2 text-xs font-bold text-[#334155]"><Copy className="h-3.5 w-3.5" /> Copy</button>
                <button onClick={() => onSaveDraft(point.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8e0ea] bg-white px-3 py-2 text-xs font-bold text-[#334155]"><Save className="h-3.5 w-3.5" /> Save draft</button>
                {status === "waiting_approval" ? (
                  <button onClick={() => onApprove(point.id)} className="rounded-lg bg-[#0f766e] px-3 py-2 text-xs font-bold text-white">Approve</button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [workflow, setWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [selectedStep, setSelectedStep] = useState<ExpandedWorkflowNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [slackConnected, setSlackConnected] = useState(false);
  const [executionStatuses, setExecutionStatuses] = useState<Record<string, LocalExecutionStatus>>({});

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

  useEffect(() => {
    const stored = window.localStorage.getItem("luma_command_center_status");
    if (!stored) return;

    try {
      setExecutionStatuses(JSON.parse(stored) as Record<string, LocalExecutionStatus>);
    } catch {
      setExecutionStatuses({});
    }
  }, []);

  function updateExecutionStatuses(updater: (current: Record<string, LocalExecutionStatus>) => Record<string, LocalExecutionStatus>) {
    setExecutionStatuses((current) => {
      const next = updater(current);
      window.localStorage.setItem("luma_command_center_status", JSON.stringify(next));
      return next;
    });
  }

  function startCommandCenter() {
    if (!workflow) return;
    const points = workflow.execution_points?.length ? workflow.execution_points : [];
    const ids = points.length ? points.map((point) => point.id) : workflow.workflow.slice(0, 6).map((node) => node.id);
    updateExecutionStatuses(() => Object.fromEntries(ids.map((id) => [id, "pending" as LocalExecutionStatus])));
    setToast("Execution queue started. Luma will generate drafts and wait for approval before public actions.");
    window.setTimeout(() => setToast(""), 3200);
  }

  function generateExecutionPoint(id: string, requiresApproval: boolean) {
    updateExecutionStatuses((current) => ({ ...current, [id]: "running" }));
    window.setTimeout(() => {
      updateExecutionStatuses((current) => ({
        ...current,
        [id]: requiresApproval ? "waiting_approval" : "completed",
      }));
    }, 650);
  }

  function approveExecutionPoint(id: string) {
    updateExecutionStatuses((current) => ({ ...current, [id]: "approved" }));
  }

  async function copyExecutionText(text: string) {
    await navigator.clipboard?.writeText(text);
    setToast("Copied draft preview.");
    window.setTimeout(() => setToast(""), 2200);
  }

  function saveDraft(id: string) {
    updateExecutionStatuses((current) => ({ ...current, [id]: current[id] === "waiting_approval" ? "waiting_approval" : "completed" }));
    setToast("Draft saved locally. Public posting still requires approval.");
    window.setTimeout(() => setToast(""), 2600);
  }

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
      setExecutionStatuses({});
      window.localStorage.removeItem("luma_command_center_status");
      window.localStorage.setItem("luma_execution_workflow", JSON.stringify(data));
      window.localStorage.setItem("luma_execution_prompt", trimmedPrompt);
    } catch {
      const fallbackWorkflow = makeFirst100FallbackWorkflow(trimmedPrompt);
      setWorkflow(fallbackWorkflow);
      setExecutionStatuses({});
      window.localStorage.removeItem("luma_command_center_status");
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

                <FlowchartBoard
                  nodes={workflow.flow_nodes?.length ? workflow.flow_nodes : workflow.workflow}
                  selectedId={selectedStep?.id}
                  onSelect={(node) => setSelectedStep(node as ExpandedWorkflowNode)}
                />

                <CommandCenter
                  workflow={workflow}
                  statuses={executionStatuses}
                  onStart={startCommandCenter}
                  onGenerate={generateExecutionPoint}
                  onApprove={approveExecutionPoint}
                  onCopy={copyExecutionText}
                  onSaveDraft={saveDraft}
                />

                {workflow.daily_plan?.length ? (
                  <section className="rounded-2xl border border-[#d8e0ea] bg-white/92 p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">7-day plan</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {workflow.daily_plan.map((day) => (
                        <div key={day.day} className="rounded-2xl border border-[#eadfbf] bg-[#fffaf0] p-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-sm font-bold text-[#111827]">Day {day.day}: {day.daily_goal}</h3>
                            <span className="rounded-full bg-white px-2 py-1 text-[11px] font-bold text-[#92400e] ring-1 ring-[#f6d365]">{day.human_approval_needed ? "Approval" : "AI"}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {day.platforms.map((platform) => (
                              <span key={`${day.day}-${platform}`} className="rounded-full bg-[#ecfdf5] px-2 py-1 text-[11px] font-bold text-[#0f766e]">{platform}</span>
                            ))}
                          </div>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#526172]">
                            {day.x_posts.slice(0, 2).map((post, index) => <li key={index}>X {index + 1}: {post}</li>)}
                            <li>LinkedIn: {day.linkedin_post}</li>
                            <li>Reddit/community: {day.reddit_community_action}</li>
                            <li>Email: {day.cold_outreach_task}</li>
                          </ul>
                          <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#64748b]">{day.expected_output}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {workflow.customer_discovery?.length ? (
                  <section className="rounded-2xl border border-[#d8e0ea] bg-white/92 p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Customer discovery</p>
                    <p className="mt-2 text-sm leading-6 text-[#526172]">Suggested search targets, potential customer segments, people to look for, and search keywords. Luma does not claim live scraping unless an API is connected.</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {workflow.customer_discovery.map((target) => (
                        <div key={target.segment} className="rounded-2xl border border-[#d8e0ea] bg-[#f8fafc] p-4">
                          <h3 className="font-bold text-[#111827]">{target.segment}</h3>
                          <div className="mt-3 grid gap-3 text-xs leading-5 text-[#526172]">
                            <p><strong>LinkedIn:</strong> {target.linkedin_search_keywords.join(", ")}</p>
                            <p><strong>X:</strong> {target.x_search_keywords.join(", ")}</p>
                            <p><strong>Reddit:</strong> {target.reddit_communities.join(", ")}</p>
                            <p><strong>Product Hunt:</strong> {target.product_hunt_audiences.join(", ")}</p>
                            <p><strong>Founder communities:</strong> {target.founder_communities.join(", ")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
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
