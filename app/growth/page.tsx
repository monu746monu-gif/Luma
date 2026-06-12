import Link from "next/link";
import { ArrowLeft, ChartColumn, TrendingUp } from "lucide-react";

const platformGrowth = [
  {
    platform: "Product Hunt",
    color: "bg-orange-500",
    accent: "text-orange-700",
    current: "1.8k views",
    sample: [18, 26, 34, 28, 42, 55, 64],
    note: "Launch-day discovery, makers, and upvotes.",
  },
  {
    platform: "X",
    color: "bg-slate-900",
    accent: "text-slate-700",
    current: "4.2k impressions",
    sample: [14, 20, 28, 36, 45, 58, 66],
    note: "Founder threads, replies, and repost loops.",
  },
  {
    platform: "LinkedIn",
    color: "bg-sky-600",
    accent: "text-sky-700",
    current: "2.9k impressions",
    sample: [12, 18, 24, 30, 33, 39, 48],
    note: "Professional reach, founder credibility, and comments.",
  },
  {
    platform: "Reddit",
    color: "bg-rose-600",
    accent: "text-rose-700",
    current: "860 views",
    sample: [8, 11, 15, 13, 18, 21, 25],
    note: "Community feedback and problem-first posts.",
  },
  {
    platform: "Email",
    color: "bg-emerald-600",
    accent: "text-emerald-700",
    current: "310 sends",
    sample: [10, 14, 19, 22, 24, 27, 32],
    note: "Warm outreach, follow-ups, and direct replies.",
  },
  {
    platform: "LinkedIn Ads",
    color: "bg-violet-600",
    accent: "text-violet-700",
    current: "Sample only",
    sample: [6, 10, 14, 18, 17, 21, 24],
    note: "Reserved for future paid growth tracking.",
  },
];

function GrowthBars({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);

  return (
    <div className="mt-4 flex h-36 items-end gap-2 rounded-xl bg-[#f8fafc] p-3">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
          <div
            className={`w-full rounded-t-md ${color}`}
            style={{ height: `${Math.max((value / max) * 100, 14)}%` }}
          />
          <span className="text-[10px] font-semibold text-[#94a3b8]">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export default function GrowthPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#111827]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-[#d8e0ea] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0f766e]">Growth page</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#111827]">Platform growth graphs</h1>
            <p className="mt-1 text-sm leading-6 text-[#526172]">
              Sample space for tracking every platform now. We can swap in real analytics later without changing the layout.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#d8e0ea] bg-white px-3.5 py-2 text-sm font-bold text-[#111827] transition hover:bg-[#f8fafc]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {platformGrowth.map((platform) => (
            <section
              key={platform.platform}
              className="rounded-2xl border border-[#d8e0ea] bg-white p-4 shadow-[0_14px_42px_rgba(18,24,38,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${platform.color} text-white`}>
                      <ChartColumn className="h-4 w-4" />
                    </span>
                    <h2 className="text-base font-bold text-[#111827]">{platform.platform}</h2>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#526172]">{platform.note}</p>
                </div>
                <span className={`rounded-full bg-[#f8fafc] px-2.5 py-1 text-xs font-bold ${platform.accent}`}>
                  {platform.current}
                </span>
              </div>

              <GrowthBars values={platform.sample} color={platform.color} />

              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#64748b]">
                <span>Sample 7-day trend</span>
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Growth placeholder
                </span>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
