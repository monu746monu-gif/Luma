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
  hover_summary?: string;
  expanded_details?: string[];
  outputs?: string[];
  human_role?: string;
  ai_role?: string;
  tools_needed?: string[];
  next_action?: string;
};

export type GeneratedWorkflow = {
  product_brain: {
    summary: string;
    positioning: string;
    best_channels: string[];
    core_audience: string[];
  };
  workflow: WorkflowNodeData[];
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
