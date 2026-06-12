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

  return (
    <button
      onClick={onSelect}
      className={`group relative z-10 w-full rounded-lg border bg-white/94 p-4 text-left shadow-[0_14px_34px_rgba(18,24,38,0.12)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(18,24,38,0.16)] ${
        isSelected ? "border-[#0f766e] ring-4 ring-[#99f6e4]/50" : "border-white/70"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
            isHuman
              ? "bg-[#eef2f7] text-[#334155]"
              : isSystem
                ? "bg-[#ecfdf5] text-[#0f766e]"
                : "bg-[#fff7ed] text-[#c2410c]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-bold tracking-tight text-[#111827]">{node.title}</h3>
            <span className="rounded-md bg-[#eef2f7] px-2 py-1 text-[10px] font-bold text-[#64748b]">0{index + 1}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#526172]">{shortDescription(node.description)}</p>

          <div className="mt-3 max-h-0 overflow-hidden rounded-xl border border-transparent bg-[#f8fafc] p-0 opacity-0 transition-all duration-300 group-hover:max-h-[16rem] group-hover:border-[#d6dde8] group-hover:p-3 group-hover:opacity-100">
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
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            isHuman
              ? "bg-[#eef2f7] text-[#334155]"
              : isSystem
                ? "bg-[#ecfdf5] text-[#0f766e]"
                : "bg-[#fff7ed] text-[#9a3412]"
          }`}
        >
          {badge}
        </span>
        <span className="rounded-md border border-[#d6dde8] bg-white px-2.5 py-1 text-[11px] font-bold text-[#526172]">
          {node.app}
        </span>
        <span className="rounded-md bg-[#111827] px-2.5 py-1 text-[11px] font-bold capitalize text-white">{node.status}</span>
      </div>

      <div className="mt-4 border-t border-[#d6dde8] pt-3 text-[11px] font-semibold text-[#64748b]">{node.agent}</div>
    </button>
  );
}
