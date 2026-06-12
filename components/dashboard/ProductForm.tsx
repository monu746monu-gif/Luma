"use client";

import { Bot, FileText, KeyRound, Send, Slack, Sparkles, Target, Users } from "lucide-react";
import type { ProductInput } from "./types";

type ProductFormProps = {
  value: ProductInput;
  isLoading: boolean;
  isOpen: boolean;
  onChange: (next: ProductInput) => void;
  onGenerate: () => void;
  onClose: () => void;
};

const productFields: {
  key: keyof ProductInput;
  label: string;
  multiline?: boolean;
}[] = [
  { key: "productName", label: "Product name" },
  { key: "description", label: "Product description", multiline: true },
  { key: "targetAudience", label: "Target audience" },
  { key: "currentStage", label: "Current stage" },
  { key: "desiredWorkflow", label: "What do you want Luma to do?", multiline: true },
  { key: "launchGoal", label: "Success goal" },
  { key: "tone", label: "Brand tone" },
];

const roleOptions = [
  "Founder",
  "Product Manager",
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Designer",
  "Growth Marketer",
  "Sales",
  "Customer Support",
  "Data Analyst",
];

const agentOptions = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Manus", "Devin", "Cursor", "Replit Agent", "Lovable", "OpenHands"];

const toolOptions = ["Gmail", "X", "LinkedIn", "Reddit", "Product Hunt", "Notion", "Slack", "GitHub", "Linear", "HubSpot"];

function toggleCsvValue(currentValue: string, item: string) {
  const values = currentValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const nextValues = values.includes(item) ? values.filter((value) => value !== item) : [...values, item];
  return nextValues.join(", ");
}

function OptionChips({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (next: string) => void;
}) {
  const selected = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#7c6f64]">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(toggleCsvValue(value, option))}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                isSelected
                  ? "border-[#241a14] bg-[#241a14] text-[#fffdf8]"
                  : "border-[#e8dccb] bg-white text-[#5f5147] hover:border-[#d97706]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProductForm({ value, isLoading, isOpen, onChange, onGenerate, onClose }: ProductFormProps) {
  if (!isOpen) return null;
  const hasSlack = value.tools
    .split(",")
    .map((tool) => tool.trim())
    .includes("Slack");

  return (
    <div className="fixed inset-0 z-50 bg-[#241a14]/30 p-4 backdrop-blur-sm">
      <button aria-label="Close product editor" className="absolute inset-0 cursor-default" onClick={onClose} />
      <aside className="relative ml-auto flex h-full w-full max-w-md flex-col rounded-3xl border border-[#e8dccb] bg-[#fffdf8] p-5 shadow-[0_28px_90px_rgba(36,26,20,0.22)]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#241a14] text-[#f7d98d]">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#241a14]">Teach Luma Your Product</h2>
              <p className="mt-1 text-sm leading-6 text-[#7c6f64]">Connect Slack or explain manually, then Luma builds the marketing strategy and workflow.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full border border-[#e8dccb] bg-white px-3 py-1.5 text-xs font-bold text-[#7c6f64]">
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onChange({ ...value, tools: hasSlack ? value.tools : toggleCsvValue(value.tools, "Slack") })}
              className={`rounded-2xl border p-3 text-left transition ${
                hasSlack ? "border-[#241a14] bg-[#241a14] text-[#fffdf8]" : "border-[#e8dccb] bg-white text-[#241a14] hover:border-[#d97706]"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Slack className="h-4 w-4" />
              </span>
              <span className="mt-3 block text-sm font-bold">Connect Slack</span>
              <span className={`mt-1 block text-xs leading-5 ${hasSlack ? "text-[#f6e7ca]" : "text-[#7c6f64]"}`}>
                Give Luma workspace context, team names, and product discussions.
              </span>
            </button>

            <button type="button" className="rounded-2xl border border-[#e8dccb] bg-white p-3 text-left text-[#241a14] transition hover:border-[#d97706]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff7e6] text-[#d97706]">
                <FileText className="h-4 w-4" />
              </span>
              <span className="mt-3 block text-sm font-bold">Explain manually</span>
              <span className="mt-1 block text-xs leading-5 text-[#7c6f64]">Use the fields below when Slack is not connected yet.</span>
            </button>
          </div>

          <label className="block rounded-2xl border border-[#e8dccb] bg-white p-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#7c6f64]">
              <KeyRound className="h-3.5 w-3.5 text-[#d97706]" />
              OpenAI API key
            </span>
            <input
              type="password"
              value={value.apiKey}
              placeholder="sk-..."
              onChange={(event) => onChange({ ...value, apiKey: event.target.value })}
              className="mt-2 w-full rounded-xl border border-[#e8dccb] bg-[#fffdf8] px-3.5 py-3 text-sm font-medium text-[#241a14] outline-none transition focus:border-[#d97706] focus:ring-4 focus:ring-[#f5d890]/45"
            />
            <p className="mt-2 text-xs leading-5 text-[#7c6f64]">Used only for this generation request. Luma does not store it.</p>
          </label>

          {productFields.map((field) => (
            <label key={field.key} className="block">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#7c6f64]">
                {field.key === "desiredWorkflow" ? <Target className="h-3.5 w-3.5 text-[#d97706]" /> : null}
                {field.label}
              </span>
              {field.multiline ? (
                <textarea
                  value={value[field.key]}
                  onChange={(event) => onChange({ ...value, [field.key]: event.target.value })}
                  rows={5}
                  className="mt-2 w-full resize-none rounded-2xl border border-[#e8dccb] bg-white px-3.5 py-3 text-sm font-medium text-[#241a14] outline-none transition focus:border-[#d97706] focus:ring-4 focus:ring-[#f5d890]/45"
                />
              ) : (
                <input
                  value={value[field.key]}
                  onChange={(event) => onChange({ ...value, [field.key]: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#e8dccb] bg-white px-3.5 py-3 text-sm font-medium text-[#241a14] outline-none transition focus:border-[#d97706] focus:ring-4 focus:ring-[#f5d890]/45"
                />
              )}
            </label>
          ))}

          <div className="rounded-2xl border border-[#e8dccb] bg-white p-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#7c6f64]">
              <Users className="h-3.5 w-3.5 text-[#d97706]" />
              Team setup Luma must route work to
            </span>
            <label className="mt-3 block">
              <span className="text-xs font-bold text-[#7c6f64]">How many people are in your team?</span>
              <input
                value={value.teamSize}
                onChange={(event) => onChange({ ...value, teamSize: event.target.value })}
                className="mt-2 w-full rounded-xl border border-[#e8dccb] bg-[#fffdf8] px-3.5 py-3 text-sm font-medium text-[#241a14] outline-none transition focus:border-[#d97706] focus:ring-4 focus:ring-[#f5d890]/45"
              />
            </label>
            <div className="mt-4">
              <OptionChips label="Positions and responsibilities" value={value.teamRoles} options={roleOptions} onChange={(teamRoles) => onChange({ ...value, teamRoles })} />
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dccb] bg-white p-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#7c6f64]">
              <Sparkles className="h-3.5 w-3.5 text-[#d97706]" />
              AI agents and tools Luma is allowed to use
            </span>
            <div className="mt-3">
              <OptionChips label="AI agents" value={value.aiAgents} options={agentOptions} onChange={(aiAgents) => onChange({ ...value, aiAgents })} />
            </div>
            <div className="mt-4">
              <OptionChips label="Platforms and tools" value={value.tools} options={toolOptions} onChange={(tools) => onChange({ ...value, tools })} />
            </div>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#241a14] px-5 py-3.5 text-sm font-bold text-[#fffdf8] shadow-[0_14px_30px_rgba(38,27,20,0.18)] transition hover:-translate-y-0.5 hover:bg-[#3a2a20] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Mapping workflow..." : "Generate Marketing Workflow"}
          <Send className="h-4 w-4" />
        </button>
      </aside>
    </div>
  );
}
