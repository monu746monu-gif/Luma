"use client";

import { Activity, CheckCircle, UserCheck } from "lucide-react";
import type { GeneratedWorkflow } from "./types";

function toDisplayText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    return value.map(toDisplayText).filter(Boolean).join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value)
      .map(toDisplayText)
      .filter(Boolean)
      .join(" — ");
  }

  return "";
}

export function RightPanel({ workflow }: { workflow: GeneratedWorkflow | null }) {
  const brain = workflow?.product_brain;

  const bestChannels = Array.isArray(brain?.best_channels)
    ? brain.best_channels
    : [];

  const coreAudience = Array.isArray(brain?.core_audience)
    ? brain.core_audience
    : [];

  const humanTasks = Array.isArray(workflow?.human_tasks)
    ? workflow.human_tasks
    : [];

  const traceEvents = Array.isArray(workflow?.trace)
    ? workflow.trace
    : ["Product brain waiting", "Workflow not generated yet", "Approvals not routed yet"];

  return (
    <aside className="space-y-4 lg:min-h-[680px]">
      <div className="rounded-2xl border border-[#ecd8b8] bg-[#fffaf1]/95 p-4 shadow-[0_18px_45px_rgba(92,64,48,0.10)]">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-[#d8912f]" />
          <h3 className="text-sm font-bold text-[#261b14]">
            Product Brain Summary
          </h3>
        </div>

        {brain ? (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a6b53]">
                Positioning
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5c4030]">
                {toDisplayText(brain.positioning) || "No positioning generated yet."}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a6b53]">
                Best channels
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {bestChannels.length > 0 ? (
                  bestChannels.map((channel, index) => {
                    const channelText = toDisplayText(channel);

                    return (
                      <span
                        key={`channel-${index}`}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#6d4d38] ring-1 ring-[#ead6b7]"
                      >
                        {channelText || "Channel"}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-sm leading-6 text-[#7a5a42]">
                    Channels will appear after generation.
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#8a6b53]">
                Core audience
              </p>

              <ul className="mt-2 space-y-2">
                {coreAudience.length > 0 ? (
                  coreAudience.map((audience, index) => (
                    <li
                      key={`audience-${index}`}
                      className="text-sm leading-5 text-[#5c4030]"
                    >
                      {toDisplayText(audience) || "Audience segment"}
                    </li>
                  ))
                ) : (
                  <li className="text-sm leading-6 text-[#7a5a42]">
                    Audience segments will appear after generation.
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[#7a5a42]">
            Generate a workflow to see positioning, channels, and launch memory.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-[#ecd8b8] bg-white p-4 shadow-[0_18px_45px_rgba(92,64,48,0.10)]">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#5d4634]" />
          <h3 className="text-sm font-bold text-[#261b14]">
            Human Approval Needed
          </h3>
        </div>

        <div className="mt-4 space-y-3">
          {humanTasks.length > 0 ? (
            humanTasks.slice(0, 4).map((task, index) => {
              const taskTitle = toDisplayText(
                typeof task === "object" && task !== null && "title" in task
                  ? task.title
                  : task
              );

              const taskReason = toDisplayText(
                typeof task === "object" && task !== null && "reason" in task
                  ? task.reason
                  : ""
              );

              return (
                <div
                  key={`human-task-${index}`}
                  className="rounded-xl border border-[#ead6b7] bg-[#fffaf1] p-3"
                >
                  <p className="text-sm font-bold text-[#261b14]">
                    {taskTitle || "Human approval task"}
                  </p>

                  {taskReason ? (
                    <p className="mt-1 text-xs leading-5 text-[#7a5a42]">
                      {taskReason}
                    </p>
                  ) : null}

                  <button className="mt-3 rounded-full bg-[#261b14] px-3 py-1.5 text-xs font-bold text-[#fff7e7]">
                    Approve
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-sm leading-6 text-[#7a5a42]">
              Approval gates will appear after generation.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[#ecd8b8] bg-[#fffaf1]/95 p-4 shadow-[0_18px_45px_rgba(92,64,48,0.10)]">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#3f7d50]" />
          <h3 className="text-sm font-bold text-[#261b14]">Trace Timeline</h3>
        </div>

        <div className="mt-4 space-y-3">
          {traceEvents.map((event, index) => (
            <div key={`trace-${index}`} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#d8912f] ring-1 ring-[#ead6b7]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <p className="pt-1 text-sm leading-5 text-[#5c4030]">
                {toDisplayText(event) || "Trace event"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}