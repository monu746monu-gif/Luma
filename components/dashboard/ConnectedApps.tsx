import { Briefcase, Mail, MessageCircle, Rocket, Send, Slack } from "lucide-react";

const apps = [
  { name: "Slack", icon: Slack },
  { name: "Gmail", icon: Mail },
  { name: "X", icon: MessageCircle },
  { name: "LinkedIn", icon: Briefcase },
  { name: "Reddit", icon: MessageCircle },
  { name: "Product Hunt", icon: Rocket },
];

export function ConnectedApps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "space-y-3" : "flex flex-wrap items-center gap-2"}>
      {compact ? (
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7a5a42]">
          <Send className="h-4 w-4 text-[#d8912f]" />
          Connectors
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <span
              key={app.name}
              className="inline-flex items-center gap-2 rounded-full border border-[#ecd8b8] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#3a2a20] shadow-sm"
            >
              <Icon className="h-3.5 w-3.5 text-[#d8912f]" />
              {app.name}
            </span>
          );
        })}
      </div>
      {compact ? <p className="text-xs leading-5 text-[#8a6b53]">Slack can teach Luma your product and team context.</p> : null}
    </div>
  );
}
