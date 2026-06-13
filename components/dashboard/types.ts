export type ProductInput = {
  apiKey: string;
  productName: string;
  description: string;
  targetAudience: string;
  currentStage: string;
  desiredWorkflow: string;
  launchGoal: string;
  tone: string;
  teamSize: string;
  teamRoles: string;
  aiAgents: string;
  tools: string;
};

export type WorkflowOwner = "ai" | "human" | "system";

export type WorkflowNodeData = {
  id: string;
  title: string;
  description: string;
  owner: WorkflowOwner;
  agent: string;
  status: string;
  app: string;
  icon: string;
  x?: number;
  y?: number;
  layoutGroup?: string;
  colorTone?: "ai" | "human" | "platform" | "system";
  action_type?: string;
  requires_approval?: boolean;
  detailed_plan?: string[];
  execution_button_label?: string;
  hover_summary?: string;
  expanded_details?: string[];
  outputs?: string[];
  human_role?: string;
  ai_role?: string;
  tools_needed?: string[];
  next_action?: string;
};

export type DailyMarketingPlan = {
  day: number;
  daily_goal: string;
  platforms: string[];
  x_posts: string[];
  linkedin_post: string;
  reddit_community_action: string;
  cold_outreach_task: string;
  expected_output: string;
  human_approval_needed: boolean;
};

export type CustomerDiscoveryTarget = {
  segment: string;
  where_to_find: string[];
  linkedin_search_keywords: string[];
  x_search_keywords: string[];
  reddit_communities: string[];
  product_hunt_audiences: string[];
  founder_communities: string[];
};

export type ExecutionPoint = {
  id: string;
  title: string;
  what_ai_will_do: string;
  platform: string;
  requires_approval: boolean;
  output_preview: string;
};

export type GeneratedWorkflow = {
  product_brain: {
    summary: string;
    positioning: string;
    best_channels: string[];
    core_audience: string[];
  };
  workflow: WorkflowNodeData[];
  flow_nodes?: WorkflowNodeData[];
  daily_plan?: DailyMarketingPlan[];
  customer_discovery?: CustomerDiscoveryTarget[];
  execution_points?: ExecutionPoint[];
  platform_content: {
    platform: string;
    content_type: string;
    draft: string;
    owner: string;
    tool: string;
  }[];
  human_tasks: {
    title: string;
    reason: string;
  }[];
  ai_tasks: {
    title: string;
    tool: string;
  }[];
  trace: string[];
};
