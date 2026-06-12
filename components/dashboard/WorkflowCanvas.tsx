"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Edit3,
  FileText,
  RefreshCw,
  Slack,
  Sparkles,
  UserCheck,
  Workflow,
} from "lucide-react";
import type { GeneratedWorkflow, ProductInput, WorkflowNodeData } from "./types";
import { NodeInspector } from "./NodeInspector";
import { WorkflowNode } from "./WorkflowNode";

type WorkflowCanvasProps = {
  workflow: GeneratedWorkflow | null;
  product: ProductInput;
  isLoading: boolean;
  selectedNode: WorkflowNodeData | null;
  onSelectNode: (node: WorkflowNodeData) => void;
  onEditProduct: () => void;
  onGenerate: () => void;
};

const fallbackTrace = ["Product and stage read", "Workflow waiting", "Team routing pending", "Agent plan pending"];

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function PromptBar({ product, onEditProduct }: { product: ProductInput; onEditProduct: () => void }) {
  const hasSlack = splitCsv(product.tools).includes("Slack");

  return (
    <div className="rounded-lg border border-white/70 bg-white/88 px-3 py-2 shadow-[0_12px_40px_rgba(18,24,38,0.10)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0f766e] text-white">
            {hasSlack ? <Slack className="h-4 w-4" /> : <Workflow className="h-4 w-4" />}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">{hasSlack ? "Slack connected + manual context" : "Manual product context"}</p>
            <p className="min-w-0 truncate text-sm font-semibold text-[#1f2937]">
              {product.desiredWorkflow || "Describe the marketing workflow Luma should create"}
            </p>
          </div>
        </div>
        <button
          onClick={onEditProduct}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#d6dde8] bg-white px-3 py-2 text-xs font-bold text-[#1f2937] transition hover:border-[#0f766e]"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit inputs
        </button>
      </div>
    </div>
  );
}

function OnboardingPath() {
  const steps = [
    { title: "Connect Slack", copy: "Give Luma product and team context.", icon: Slack },
    { title: "Explain manually", copy: "Add product, stage, audience, and goal.", icon: FileText },
    { title: "Generate strategy", copy: "Pick channels, messaging, and schedule.", icon: Brain },
    { title: "Assign + track", copy: "Route human work and monitor progress.", icon: UserCheck },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="rounded-lg border border-[#d6dde8] bg-white/92 p-3 shadow-[0_10px_30px_rgba(18,24,38,0.06)]">
            <div className="flex items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#0f766e]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="rounded-md bg-[#eef2f7] px-2 py-1 text-[10px] font-bold text-[#64748b]">0{index + 1}</span>
            </div>
            <p className="mt-3 text-sm font-bold text-[#111827]">{step.title}</p>
            <p className="mt-1 text-xs leading-5 text-[#526172]">{step.copy}</p>
          </div>
        );
      })}
    </div>
  );
}

function ContextRail({ product, workflow }: { product: ProductInput; workflow: GeneratedWorkflow | null }) {
  const roles = splitCsv(product.teamRoles);
  const agents = splitCsv(product.aiAgents);
  const channels = workflow?.product_brain.best_channels?.length ? workflow.product_brain.best_channels : splitCsv(product.tools);

  return (
    <aside className="grid gap-3 lg:grid-cols-3">
      <div className="rounded-lg border border-[#d6dde8] bg-white/92 p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">
          <Brain className="h-4 w-4 text-[#0f766e]" />
          Product stage
        </div>
        <p className="mt-3 text-sm font-semibold text-[#111827]">{product.productName}</p>
        <p className="mt-1 text-sm leading-5 text-[#526172]">{product.currentStage}</p>
      </div>

      <div className="rounded-lg border border-[#d6dde8] bg-white/92 p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">
          <UserCheck className="h-4 w-4 text-[#334155]" />
          Team routing
        </div>
        <p className="mt-3 text-sm font-semibold text-[#111827]">{product.teamSize || roles.length} people</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {roles.slice(0, 5).map((role) => (
            <span key={role} className="rounded-md bg-[#eef2f7] px-2 py-1 text-[11px] font-bold text-[#334155]">
              {role}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#d6dde8] bg-white/92 p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">
          <Bot className="h-4 w-4 text-[#c2410c]" />
          Allowed agents
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {agents.slice(0, 6).map((agent) => (
            <span key={agent} className="rounded-md bg-[#fff1e8] px-2 py-1 text-[11px] font-bold text-[#9a3412]">
              {agent}
            </span>
          ))}
        </div>
        <p className="mt-3 truncate text-xs font-semibold text-[#64748b]">{channels.slice(0, 4).join(" / ")}</p>
      </div>
    </aside>
  );
}

function FlowBoard({
  nodes,
  selectedNode,
  onSelectNode,
}: {
  nodes: WorkflowNodeData[];
  selectedNode: WorkflowNodeData | null;
  onSelectNode: (node: WorkflowNodeData) => void;
}) {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-white/60 bg-[#dfe5ec]/74 p-5 shadow-[0_20px_70px_rgba(18,24,38,0.12)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(219,234,254,0.58),rgba(255,255,255,0.26)_42%,rgba(254,226,226,0.42))]" />
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] opacity-30 [background-size:24px_24px]" />

      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {nodes.map((node, index) => (
          <motion.div
            key={`${node.id}-${node.title}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.28 }}
            className={index % 2 === 1 ? "xl:mt-20" : index % 4 === 2 ? "xl:mt-10" : ""}
          >
            <WorkflowNode node={node} index={index} isSelected={selectedNode?.id === node.id} onSelect={() => onSelectNode(node)} />
            {index < nodes.length - 1 ? (
              <div className="hidden xl:block">
                <ArrowRight className="absolute top-1/2 ml-[calc(25%-1.1rem)] h-5 w-5 -translate-y-1/2 text-[#64748b]" />
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TaskPanel({ workflow }: { workflow: GeneratedWorkflow }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.15fr]">
      <div className="rounded-lg border border-[#d6dde8] bg-white p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[#c2410c]" />
          <h3 className="text-sm font-bold text-[#111827]">AI will create</h3>
        </div>
        <div className="mt-4 space-y-3">
          {workflow.ai_tasks.slice(0, 5).map((task) => (
            <div key={`${task.title}-${task.tool}`} className="rounded-lg bg-[#fff7ed] p-3">
              <p className="text-sm font-bold text-[#1f2937]">{task.title}</p>
              <p className="mt-1 text-xs font-semibold text-[#9a3412]">{task.tool}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#d6dde8] bg-white p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#334155]" />
          <h3 className="text-sm font-bold text-[#111827]">Humans handle</h3>
        </div>
        <div className="mt-4 space-y-3">
          {workflow.human_tasks.slice(0, 5).map((task) => (
            <div key={task.title} className="rounded-lg bg-[#eef2f7] p-3">
              <p className="text-sm font-bold text-[#1f2937]">{task.title}</p>
              <p className="mt-1 text-xs leading-5 text-[#526172]">{task.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[#d6dde8] bg-white p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#0f766e]" />
          <h3 className="text-sm font-bold text-[#111827]">Channel drafts</h3>
        </div>
        <div className="mt-4 space-y-3">
          {workflow.platform_content.slice(0, 4).map((item) => (
            <div key={`${item.platform}-${item.content_type}`} className="rounded-lg border border-[#d6dde8] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#1f2937]">{item.platform}</p>
                <span className="rounded-md bg-[#ecfdf5] px-2 py-1 text-[11px] font-bold text-[#0f766e]">{item.tool}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#64748b]">{item.content_type} by {item.owner}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#526172]">{item.draft}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkflowCanvas({
  workflow,
  product,
  isLoading,
  selectedNode,
  onSelectNode,
  onEditProduct,
  onGenerate,
}: WorkflowCanvasProps) {
  const visibleWorkflow = workflow?.workflow.slice(0, 8) ?? [];
  const trace = workflow?.trace?.length ? workflow.trace : fallbackTrace;

  return (
    <section className="relative min-h-[calc(100dvh-96px)] overflow-hidden rounded-lg border border-[#d6dde8] bg-[#f7f9fc] shadow-[0_28px_90px_rgba(18,24,38,0.12)]">
      <div className="relative z-20 border-b border-[#d6dde8] bg-white/78 p-4 backdrop-blur-xl lg:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Marketing command center</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#111827]">Plan, assign, execute, and track marketing</h1>
            <p className="mt-1 text-sm font-medium text-[#526172]">Connect Slack or explain the product manually, then Luma builds the strategy and workflow.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#d6dde8] bg-white px-3.5 py-2 text-xs font-bold text-[#1f2937] shadow-sm">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              onClick={onGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-3.5 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-70"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Regenerate
            </button>
          </div>
        </div>
        <div className="mt-4">
          <PromptBar product={product} onEditProduct={onEditProduct} />
        </div>
      </div>

      <div className="relative z-10 grid gap-5 p-4 lg:p-5">
        <ContextRail product={product} workflow={workflow} />
        <OnboardingPath />

        {!workflow ? (
          <div className="grid min-h-[520px] place-items-center rounded-lg border border-dashed border-[#b8c3d1] bg-white/70 p-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md text-center"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#111827] text-white">
                {isLoading ? <Sparkles className="h-6 w-6 animate-pulse" /> : <Workflow className="h-6 w-6" />}
              </span>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-[#111827]">
                {isLoading ? "Luma is building the marketing flow..." : "Generate a human + AI workflow"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#526172]">
                Luma will learn your product, suggest the best marketing platforms, assign human-only work, create AI-ready content, and track progress.
              </p>
              <button
                onClick={onGenerate}
                disabled={isLoading}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(15,118,110,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Generate Flow
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="grid gap-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
              <FlowBoard nodes={visibleWorkflow} selectedNode={selectedNode} onSelectNode={onSelectNode} />
              <div className="grid gap-4">
                <NodeInspector node={selectedNode} />
                <div className="rounded-lg border border-[#d6dde8] bg-white p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#0f766e]" />
                    <h3 className="text-sm font-bold text-[#111827]">Trace</h3>
                  </div>
                  <div className="mt-4 space-y-3">
                    {trace.slice(0, 5).map((event, index) => (
                      <div key={`${event}-${index}`} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eef2f7] text-xs font-bold text-[#334155]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="pt-1 text-sm leading-5 text-[#526172]">{event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <TaskPanel workflow={workflow} />
          </div>
        )}
      </div>

      <div className="relative z-20 mx-4 mb-4 rounded-lg border border-[#d6dde8] bg-white/90 px-4 py-3 shadow-[0_14px_42px_rgba(18,24,38,0.08)] backdrop-blur lg:mx-5 lg:mb-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
            <Clock3 className="h-4 w-4 text-[#0f766e]" />
            Luma drafts and schedules AI-safe work, while human-only work stays assigned for review or manual execution.
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#ecfdf5] px-2.5 py-1.5 text-xs font-bold text-[#0f766e]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              AI drafts
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#eef2f7] px-2.5 py-1.5 text-xs font-bold text-[#334155]">
              <UserCheck className="h-3.5 w-3.5" />
              Human approval
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
