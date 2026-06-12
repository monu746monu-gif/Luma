"use client";

import { Bot, CheckCircle, RefreshCw, UserCheck, Zap } from "lucide-react";
import type { WorkflowNodeData } from "./types";

type NodeInspectorProps = {
  node: WorkflowNodeData | null;
};

export function NodeInspector({ node }: NodeInspectorProps) {
  if (!node) {
    return (
      <aside className="rounded-lg border border-[#d6dde8] bg-white p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
        <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
          <Zap className="h-4 w-4 text-[#0f766e]" />
          Inspector
        </div>
        <p className="mt-3 text-sm leading-6 text-[#526172]">Select a workflow node to inspect.</p>
      </aside>
    );
  }

  const isHuman = node.owner === "human";
  const approvalText = isHuman ? "Human work or approval required." : "AI can prepare this step before approval.";
  const details = Array.isArray(node.expanded_details) ? node.expanded_details : [];
  const outputs = Array.isArray(node.outputs) ? node.outputs : [];
  const tools = Array.isArray(node.tools_needed) ? node.tools_needed : [];

  return (
    <aside className="rounded-lg border border-[#d6dde8] bg-white p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0f766e]">Inspector</p>
          <h3 className="mt-2 text-lg font-semibold text-[#111827]">{node.title}</h3>
        </div>
        <span className="rounded-md bg-[#eef2f7] px-2.5 py-1 text-xs font-bold text-[#526172]">{node.status}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-[#eef2f7] p-3">
          <p className="font-bold text-[#64748b]">Owner</p>
          <p className="mt-1 font-semibold text-[#111827]">{isHuman ? "Human" : node.owner === "system" ? "Memory" : "AI"}</p>
        </div>
        <div className="rounded-lg bg-[#eef2f7] p-3">
          <p className="font-bold text-[#64748b]">Tool</p>
          <p className="mt-1 font-semibold text-[#111827]">{node.app}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-[#d6dde8] bg-[#f8fafc] p-3">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">What happens here</p>
        <p className="mt-2 text-sm leading-6 text-[#334155]">{node.hover_summary || node.description}</p>
      </div>

      {details.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">Expanded steps</p>
          <ul className="mt-2 space-y-2">
            {details.slice(0, 5).map((detail, index) => (
              <li key={`${node.id}-detail-${index}`} className="rounded-lg bg-[#f8fafc] p-3 text-sm leading-6 text-[#334155]">
                {detail}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {outputs.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#64748b]">Outputs</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {outputs.slice(0, 6).map((output, index) => (
              <span key={`${node.id}-output-${index}`} className="rounded-full bg-[#ecfdf5] px-2.5 py-1 text-xs font-bold text-[#0f766e]">
                {output}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#ecfdf5] p-3 text-sm font-semibold text-[#0f766e]">
        {isHuman ? <UserCheck className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
        {approvalText}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-3.5 py-2 text-xs font-bold text-white">
          <Bot className="h-3.5 w-3.5" />
          {node.next_action || "Run step"}
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-[#d6dde8] bg-white px-3.5 py-2 text-xs font-bold text-[#111827]">
          <UserCheck className="h-3.5 w-3.5" />
          Approve
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-[#d6dde8] bg-white px-3.5 py-2 text-xs font-bold text-[#111827]">
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerate
        </button>
      </div>

      {tools.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tools.slice(0, 5).map((tool) => (
            <span key={`${node.id}-tool-${tool}`} className="rounded-md bg-[#eef2f7] px-2.5 py-1 text-[11px] font-bold text-[#526172]">
              {tool}
            </span>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
