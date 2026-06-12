"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail, Megaphone, PencilLine, Send, Sparkles } from "lucide-react";

type PlatformId = "x" | "reddit" | "linkedin" | "gmail";
type ConnectablePlatformId = Exclude<PlatformId, "gmail">;
type ContentType = "launch" | "update" | "announcement" | "thread" | "email" | "followup";

type PlatformOption = {
  id: PlatformId;
  label: string;
  accent: string;
  description: string;
  logo: ReactNode;
};

const platforms: PlatformOption[] = [
  {
    id: "x",
    label: "X",
    accent: "text-black",
    description: "Fast launch posts, threads, and daily updates.",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2H21.5l-7.11 8.13L22.75 22h-6.54l-5.12-6.68L5.23 22H1.97l7.61-8.7L1.56 2h6.71l4.63 6.12L18.244 2Zm-1.14 17.9h1.8L7.29 3.99H5.36L17.104 19.9Z" />
      </svg>
    ),
  },
  {
    id: "reddit",
    label: "Reddit",
    accent: "text-[#ff4500]",
    description: "Feedback-first posts and community replies.",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M24 11.78a2.64 2.64 0 0 0-4.48-1.89c-1.81-1.2-4.25-1.95-6.95-2.04l1.18-5.56 3.86.82a1.86 1.86 0 1 0 .3-1.39L13.42.77a.7.7 0 0 0-.83.54l-1.39 6.53c-2.75.08-5.24.83-7.08 2.04A2.64 2.64 0 1 0 1.22 14.2a4.9 4.9 0 0 0-.06.75c0 3.94 4.85 7.13 10.84 7.13s10.84-3.19 10.84-7.13c0-.25-.02-.5-.06-.75A2.64 2.64 0 0 0 24 11.78ZM6.8 13.82a1.46 1.46 0 1 1 2.92 0 1.46 1.46 0 0 1-2.92 0Zm8.66 4.2c-1 .99-2.9 1.06-3.46 1.06-.57 0-2.46-.07-3.46-1.06a.7.7 0 0 1 .99-.99c.63.63 2.05.65 2.47.65.42 0 1.84-.02 2.47-.65a.7.7 0 1 1 .99.99Zm-.18-4.2a1.46 1.46 0 1 1 2.92 0 1.46 1.46 0 0 1-2.92 0Z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    accent: "text-[#0a66c2]",
    description: "Founder stories, updates, and professional posts.",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.84v2.05h.06c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.85c0-1.87-.03-4.27-2.6-4.27-2.6 0-3 2.03-3 4.13V23h-4V8Z" />
      </svg>
    ),
  },
  {
    id: "gmail",
    label: "Gmail",
    accent: "text-[#0f766e]",
    description: "Launch emails, outreach, and follow-ups.",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 4h16v16H4z" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
];

const contentTypes: { id: ContentType; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "launch", label: "Launch", description: "Launch-day positioning and announcement copy.", icon: <Megaphone className="h-4 w-4" /> },
  { id: "update", label: "Update", description: "Progress updates and build-in-public posts.", icon: <PencilLine className="h-4 w-4" /> },
  { id: "announcement", label: "Announcement", description: "Feature, milestone, or product news.", icon: <Sparkles className="h-4 w-4" /> },
  { id: "thread", label: "Thread", description: "Long-form X threads with a clear narrative.", icon: <Send className="h-4 w-4" /> },
  { id: "email", label: "Email", description: "Cold email or launch email drafts.", icon: <Mail className="h-4 w-4" /> },
  { id: "followup", label: "Follow-up", description: "Reminder or follow-up content after the first touch.", icon: <CheckCircle2 className="h-4 w-4" /> },
];

const connectablePlatformIds: ConnectablePlatformId[] = ["x", "reddit", "linkedin"];
const MAX_POST_WORDS = 100;

function limitWords(text: string, maxWords = MAX_POST_WORDS) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(" ");
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function buildDraft(prompt: string, platform: PlatformId, type: ContentType) {
  const platformLabel = platforms.find((item) => item.id === platform)?.label ?? "Platform";
  const typeLabel = contentTypes.find((item) => item.id === type)?.label ?? "Content";
  const base = prompt.trim() || "Your product";
  const body =
    type === "launch"
      ? `Announcing ${base}. Built for people who need a clearer way to market, launch, and grow.`
      : type === "update"
        ? `${base} now includes a stronger workflow, better approvals, and a clearer path to growth.`
        : type === "announcement"
          ? `A new update for ${base}: the product is ready for the next stage of growth.`
          : type === "thread"
            ? `1/ ${base} solves a real launch problem.\n\n2/ It turns a product prompt into a usable marketing workflow.\n\n3/ AI drafts, humans approve, and the team moves faster.`
            : type === "followup"
              ? `Just following up on ${base}. If this is still relevant, I can share a quick draft or walkthrough.`
              : `Hi, I’m sharing ${base} because it may be relevant to your team. Would you be open to a quick look?`;

  return {
    title: `${platformLabel} ${typeLabel}`,
    hook: `Create a ${typeLabel.toLowerCase()} for ${base} on ${platformLabel}.`,
    body: limitWords(body),
  };
}

export default function ContentPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(["x", "linkedin"]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectablePlatformId[]>([]);
  const [contentType, setContentType] = useState<ContentType>("launch");
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState<ReturnType<typeof buildDraft>[]>([]);

  const platformSummary = useMemo(
    () => platforms.filter((platform) => selectedPlatforms.includes(platform.id)),
    [selectedPlatforms]
  );

  function togglePlatform(id: PlatformId) {
    setSelectedPlatforms((current) => {
      if (current.includes(id)) {
        return current.length === 1 ? current : current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  }

  function connectPlatform(id: ConnectablePlatformId) {
    setConnectedPlatforms((current) => current.includes(id) ? current : [...current, id]);
  }

  async function generateContent() {
    setIsGenerating(true);

    window.setTimeout(() => {
      setDrafts(selectedPlatforms.map((platform) => buildDraft(prompt, platform, contentType)));
      setIsGenerating(false);
    }, 350);
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#111827]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-[#d8e0ea] pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[#d8e0ea] bg-white shadow-sm">
              <Image src="/logo.jpeg" alt="Luma logo" fill sizes="48px" className="object-cover object-center" priority />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0f766e]">Content studio</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#111827]">Generate drafts for every platform</h1>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-[#d8e0ea] bg-white px-3.5 py-2 text-sm font-bold text-[#111827] transition hover:bg-[#f8fafc]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-[#d8e0ea] bg-white p-5 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">
              <Sparkles className="h-4 w-4" />
              Content input
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#111827]">Prompt</span>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={6}
                placeholder="Describe the product, the message, and what you want content to say."
                className="mt-2 min-h-[160px] w-full resize-none rounded-xl border border-[#d8e0ea] bg-[#f8fafc] px-4 py-4 text-sm leading-7 text-[#111827] outline-none transition placeholder:text-[#94a3b8] focus:border-[#99f6e4] focus:bg-white focus:ring-4 focus:ring-[#ccfbf1]"
              />
            </label>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#111827]">Platforms</span>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#64748b]">
                  Select one or more
                </span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {platforms.map((platform) => {
                  const active = selectedPlatforms.includes(platform.id);

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${
                        active
                          ? "border-[#0f766e] bg-[#ecfdf5]"
                          : "border-[#d8e0ea] bg-[#f8fafc]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white ${platform.accent} ring-1 ring-[#d8e0ea]`}>
                          {platform.logo}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-[#111827]">{platform.label}</h3>
                            {active ? <CheckCircle2 className="h-4 w-4 text-[#0f766e]" /> : null}
                          </div>
                          <p className="mt-1 text-xs leading-5 text-[#526172]">{platform.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#d8e0ea] bg-[#f8fafc] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Connect accounts for draft handoff</p>
                  <p className="mt-1 text-xs leading-5 text-[#526172]">
                    Connect X, Reddit, or LinkedIn before generating drafts, or create copy-only drafts.
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {platforms
                  .filter((platform): platform is PlatformOption & { id: ConnectablePlatformId } =>
                    connectablePlatformIds.includes(platform.id as ConnectablePlatformId)
                  )
                  .map((platform) => {
                    const connected = connectedPlatforms.includes(platform.id);

                    return (
                      <button
                        key={`connect-${platform.id}`}
                        type="button"
                        onClick={() => connectPlatform(platform.id)}
                        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                          connected
                            ? "border-[#0f766e] bg-[#ecfdf5] text-[#0f766e]"
                            : "border-[#d8e0ea] bg-white text-[#334155] hover:border-[#0f766e]"
                        }`}
                      >
                        {platform.logo}
                        {connected ? `${platform.label} connected` : `Connect ${platform.label}`}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="mt-5">
              <span className="text-sm font-semibold text-[#111827]">Content type</span>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {contentTypes.map((item) => {
                  const active = contentType === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setContentType(item.id)}
                      className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 ${
                        active
                          ? "border-[#0f766e] bg-[#ecfdf5]"
                          : "border-[#d8e0ea] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? "bg-[#0f766e] text-white" : "bg-[#f8fafc] text-[#526172]"}`}>
                          {item.icon}
                        </span>
                        <h3 className="font-bold text-[#111827]">{item.label}</h3>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-[#526172]">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={generateContent}
                disabled={isGenerating || !selectedPlatforms.length}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(18,24,38,0.18)] transition hover:-translate-y-0.5 hover:bg-[#243041] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    Generate draft
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#d8e0ea] bg-white p-5 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Selected</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111827]">Platforms and content type</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {platformSummary.map((platform) => (
                  <span key={platform.id} className="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-bold text-[#334155] ring-1 ring-[#d8e0ea]">
                    {platform.logo}
                    {platform.label}
                  </span>
                ))}
                <span className="rounded-full bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold text-[#0f766e]">
                  {contentTypes.find((item) => item.id === contentType)?.label}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#d8e0ea] bg-white p-5 shadow-[0_14px_42px_rgba(18,24,38,0.08)]">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-[#0f766e]" />
                <h2 className="text-lg font-semibold text-[#111827]">Generated drafts</h2>
              </div>

              {drafts.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {drafts.map((draft) => (
                    <div key={draft.title} className="rounded-xl border border-[#d8e0ea] bg-[#f8fafc] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-[#111827]">{draft.title}</p>
                        <span className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-[#64748b] ring-1 ring-[#d8e0ea]">
                          Ready
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                        Hook
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#334155]">{draft.hook}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
                        Draft ({countWords(draft.body)}/{MAX_POST_WORDS} words)
                      </p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#334155]">{draft.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[#526172]">
                  Pick platforms and a content type, then generate drafts here.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
