import Link from "next/link";
import { ArrowLeft, Mail, TrendingUp } from "lucide-react";

const platformGrowth = [
  {
    platform: "Product Hunt",
    metric: "Product Hunt copy ready",
    count: "1 launch brief",
    color: "bg-orange-500",
    accent: "text-orange-700",
    sample: [18, 26, 34, 28, 42, 55, 64],
    note: "Launch-day discovery, makers, and upvotes.",
  },
  {
    platform: "X",
    metric: "X posts generated",
    count: "14 drafts",
    color: "bg-slate-900",
    accent: "text-slate-700",
    sample: [14, 20, 28, 36, 45, 58, 66],
    note: "Founder threads, replies, and repost loops.",
  },
  {
    platform: "LinkedIn",
    metric: "LinkedIn posts scheduled",
    count: "7 drafts",
    color: "bg-sky-600",
    accent: "text-sky-700",
    sample: [12, 18, 24, 30, 33, 39, 48],
    note: "Professional reach, founder credibility, and comments.",
  },
  {
    platform: "Reddit",
    metric: "Reddit posts drafted",
    count: "7 actions",
    color: "bg-rose-600",
    accent: "text-rose-700",
    sample: [8, 11, 15, 13, 18, 21, 25],
    note: "Community feedback and problem-first posts.",
  },
  {
    platform: "Email",
    metric: "Emails prepared",
    count: "70 targets",
    color: "bg-emerald-600",
    accent: "text-emerald-700",
    sample: [10, 14, 19, 22, 24, 27, 32],
    note: "Warm outreach, follow-ups, and direct replies.",
  },
  {
    platform: "Slack",
    metric: "Human approvals pending",
    count: "6 approvals",
    color: "bg-violet-600",
    accent: "text-violet-700",
    sample: [4, 7, 9, 12, 15, 18, 22],
    note: "Team context, approval routing, and warm intros.",
  },
];

const progressCards = [
  { label: "X posts generated", value: "14", tone: "bg-slate-900 text-white" },
  { label: "LinkedIn posts scheduled", value: "7", tone: "bg-sky-600 text-white" },
  { label: "Reddit posts drafted", value: "7", tone: "bg-rose-600 text-white" },
  { label: "Emails prepared", value: "70", tone: "bg-emerald-600 text-white" },
  { label: "Human approvals pending", value: "6", tone: "bg-amber-400 text-[#3f2d00]" },
  { label: "First 100 users progress", value: "32%", tone: "bg-violet-600 text-white" },
];

function GrowthBars({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);

  return (
    <div className="mt-4 flex h-36 items-end gap-2 rounded-xl bg-[#fef3c7] p-3">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
          <div
            className={`w-full rounded-t-md ${color}`}
            style={{ height: `${Math.max((value / max) * 100, 14)}%` }}
          />
          <span className="text-[10px] font-semibold text-[#a16207]">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function PlatformLogo({
  platform,
  className = "h-4 w-4",
}: {
  platform: string;
  className?: string;
}) {
  if (platform === "Product Hunt") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M13.16 5H7v14h3.2v-4.25h2.96c3.12 0 5.34-2.02 5.34-4.88C18.5 7.02 16.28 5 13.16 5Zm-.16 6.82h-2.8V7.93H13c1.35 0 2.21.75 2.21 1.94s-.86 1.95-2.21 1.95Z" />
      </svg>
    );
  }

  if (platform === "X") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M18.244 2H21.5l-7.11 8.13L22.75 22h-6.54l-5.12-6.68L5.23 22H1.97l7.61-8.7L1.56 2h6.71l4.63 6.12L18.244 2Zm-1.14 17.9h1.8L7.29 3.99H5.36L17.104 19.9Z" />
      </svg>
    );
  }

  if (platform.includes("LinkedIn")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.84v2.05h.06c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.85c0-1.87-.03-4.27-2.6-4.27-2.6 0-3 2.03-3 4.13V23h-4V8Z" />
      </svg>
    );
  }

  if (platform === "Reddit") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M24 11.78a2.64 2.64 0 0 0-4.48-1.89c-1.81-1.2-4.25-1.95-6.95-2.04l1.18-5.56 3.86.82a1.86 1.86 0 1 0 .3-1.39L13.42.77a.7.7 0 0 0-.83.54l-1.39 6.53c-2.75.08-5.24.83-7.08 2.04A2.64 2.64 0 1 0 1.22 14.2a4.9 4.9 0 0 0-.06.75c0 3.94 4.85 7.13 10.84 7.13s10.84-3.19 10.84-7.13c0-.25-.02-.5-.06-.75A2.64 2.64 0 0 0 24 11.78ZM6.8 13.82a1.46 1.46 0 1 1 2.92 0 1.46 1.46 0 0 1-2.92 0Zm8.66 4.2c-1 .99-2.9 1.06-3.46 1.06-.57 0-2.46-.07-3.46-1.06a.7.7 0 0 1 .99-.99c.63.63 2.05.65 2.47.65.42 0 1.84-.02 2.47-.65a.7.7 0 1 1 .99.99Zm-.18-4.2a1.46 1.46 0 1 1 2.92 0 1.46 1.46 0 0 1-2.92 0Z" />
      </svg>
    );
  }

  if (platform === "Slack") {
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

  return <Mail className={className} />;
}

export default function GrowthPage() {
  return (
    <main className="min-h-screen bg-[#fffbeb] text-[#1f1600]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-[#facc15] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a16207]">Growth page</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1f1600]">First 100 users growth</h1>
            <p className="mt-1 text-sm leading-6 text-[#6b4e16]">
              Track drafts, approvals, outreach, and progress across the first 7-day execution plan.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#facc15] bg-[#fef3c7] px-3.5 py-2 text-sm font-bold text-[#1f1600] transition hover:bg-[#fde68a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {progressCards.map((card) => (
            <section key={card.label} className="rounded-2xl border border-[#facc15] bg-[#fffdf2] p-4 shadow-[0_10px_30px_rgba(161,98,7,0.10)]">
              <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${card.tone}`}>{card.value}</span>
              <p className="mt-3 text-sm font-bold leading-5 text-[#1f1600]">{card.label}</p>
            </section>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platformGrowth.map((platform) => (
            <section
              key={platform.platform}
              className="rounded-2xl border border-[#facc15] bg-[#fffdf2] p-4 shadow-[0_14px_42px_rgba(161,98,7,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${platform.color} text-white`}>
                      <PlatformLogo platform={platform.platform} />
                    </span>
                    <h2 className="text-base font-bold text-[#1f1600]">{platform.platform}</h2>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#6b4e16]">{platform.note}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[#fef3c7] px-3 py-1.5 text-xs font-bold text-[#854d0e] ring-1 ring-[#facc15] transition hover:-translate-y-0.5 hover:bg-[#fde68a]"
                >
                  Connect
                </button>
              </div>

              <GrowthBars values={platform.sample} color={platform.color} />

              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#7c5f1b]">
                <span>{platform.metric}</span>
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {platform.count}
                </span>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
