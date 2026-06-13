"use client";

import {
  Activity,
  Bot,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle,
  Mail,
  MessageCircle,
  Rocket,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import type { WorkflowNodeData } from "./types";

const iconMap = {
  activity: Activity,
  bot: Bot,
  brain: Brain,
  briefcase: Briefcase,
  calendar: Calendar,
  check: CheckCircle,
  mail: Mail,
  message: MessageCircle,
  rocket: Rocket,
  search: Search,
  userCheck: UserCheck,
  users: Users,
};

const nodeTints = [
  {
    shell: "border-[#c7d2fe] bg-[rgba(238,242,255,0.78)]",
    icon: "bg-[rgba(224,231,255,0.9)] text-[#4338ca]",
    badge: "bg-[rgba(224,231,255,0.92)] text-[#4338ca]",
    app: "border-[#c7d2fe] bg-[rgba(255,255,255,0.55)] text-[#334155]",
    status: "bg-[#1f2937] text-white",
    detail: "bg-[rgba(255,255,255,0.44)]",
  },
  {
    shell: "border-[#bae6fd] bg-[rgba(240,249,255,0.78)]",
    icon: "bg-[rgba(224,242,254,0.92)] text-[#0369a1]",
    badge: "bg-[rgba(224,242,254,0.92)] text-[#0369a1]",
    app: "border-[#bae6fd] bg-[rgba(255,255,255,0.55)] text-[#334155]",
    status: "bg-[#1f2937] text-white",
    detail: "bg-[rgba(255,255,255,0.44)]",
  },
  {
    shell: "border-[#bbf7d0] bg-[rgba(240,253,244,0.78)]",
    icon: "bg-[rgba(220,252,231,0.92)] text-[#047857]",
    badge: "bg-[rgba(220,252,231,0.92)] text-[#047857]",
    app: "border-[#bbf7d0] bg-[rgba(255,255,255,0.55)] text-[#334155]",
    status: "bg-[#1f2937] text-white",
    detail: "bg-[rgba(255,255,255,0.44)]",
  },
  {
    shell: "border-[#fed7aa] bg-[rgba(255,247,237,0.8)]",
    icon: "bg-[rgba(255,237,213,0.92)] text-[#c2410c]",
    badge: "bg-[rgba(255,237,213,0.92)] text-[#c2410c]",
    app: "border-[#fed7aa] bg-[rgba(255,255,255,0.55)] text-[#334155]",
    status: "bg-[#1f2937] text-white",
    detail: "bg-[rgba(255,255,255,0.44)]",
  },
  {
    shell: "border-[#f9a8d4] bg-[rgba(253,244,255,0.76)]",
    icon: "bg-[rgba(252,231,243,0.94)] text-[#be185d]",
    badge: "bg-[rgba(252,231,243,0.94)] text-[#be185d]",
    app: "border-[#f9a8d4] bg-[rgba(255,255,255,0.55)] text-[#334155]",
    status: "bg-[#1f2937] text-white",
    detail: "bg-[rgba(255,255,255,0.44)]",
  },
];

function getIcon(icon: string, owner: WorkflowNodeData["owner"]) {
  if (icon in iconMap) {
    return iconMap[icon as keyof typeof iconMap];
  }

  if (owner === "human") return UserCheck;
  if (owner === "system") return Activity;
  return Bot;
}

function shortDescription(description: string) {
  const firstSentence = description.split(".")[0]?.trim();
  return firstSentence ? `${firstSentence}.` : description;
}

function getTint(index: number) {
  return nodeTints[index % nodeTints.length];
}

export function WorkflowNode({
  node,
  index,
  isSelected,
  onSelect,
}: {
  node: WorkflowNodeData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = getIcon(node.icon, node.owner);
  const isHuman = node.owner === "human";
  const isSystem = node.owner === "system";
  const badge = isHuman ? "Human Approval" : isSystem ? (node.icon === "activity" ? "Trace" : "Memory") : "AI Task";
  const tint = getTint(index);

  return (
    <button
      onClick={onSelect}
      className={`group relative z-10 w-full rounded-lg border p-4 text-left shadow-[0_14px_34px_rgba(18,24,38,0.12)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(18,24,38,0.16)] ${
        tint.shell
      } ${
        isSelected ? "border-[#0f766e] ring-4 ring-[#99f6e4]/50" : "border-white/70"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tint.icon}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold tracking-tight text-[#111827]">{node.title}</h3>
            <span className="rounded-md bg-[rgba(255,255,255,0.62)] px-2 py-1 text-[10px] font-bold text-[#64748b]">0{index + 1}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#526172]">{shortDescription(node.description)}</p>

          <div className={`mt-3 max-h-0 overflow-hidden rounded-xl border border-transparent p-0 opacity-0 transition-all duration-300 group-hover:max-h-[16rem] group-hover:border-[#d6dde8] group-hover:p-3 group-hover:opacity-100 ${tint.detail}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748b]">
              More detail
            </p>
            <p className="mt-1 text-xs leading-5 text-[#526172]">
              {node.hover_summary ||
                "Hover to see how Luma handles this workflow step in detail."}
            </p>

            {Array.isArray(node.expanded_details) && node.expanded_details.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {node.expanded_details.slice(0, 3).map((detail, detailIndex) => (
                  <li
                    key={`${node.id}-detail-${detailIndex}`}
                    className="text-[11px] leading-5 text-[#526172]"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tint.badge}`}
        >
          {badge}
        </span>
        <span className={`rounded-md border px-2.5 py-1 text-[11px] font-bold ${tint.app}`}>
          {node.app}
        </span>
        <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold capitalize ${tint.status}`}>{node.status}</span>
      </div>

      <div className="mt-4 border-t border-[#d6dde8] pt-3 text-[11px] font-semibold text-[#64748b]">{node.agent}</div>
    </button>
  );
}
