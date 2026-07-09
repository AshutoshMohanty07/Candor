import type { ReactElement } from "react";

type Tab = "inbox" | "share" | "insights" | "settings";

const tabs: { id: Tab; label: string; icon: (active: boolean) => ReactElement }[] = [
  {
    id: "inbox",
    label: "Inbox",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"
          stroke={active ? "url(#grad)" : "#7c6fa8"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "rgba(168,85,247,0.15)" : "none"}
        />
        <path
          d="M2 6l10 7 10-7"
          stroke={active ? "url(#grad)" : "#7c6fa8"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "share",
    label: "Share",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
          stroke={active ? "url(#grad2)" : "#7c6fa8"}
          strokeWidth="2"
          fill={active ? "rgba(168,85,247,0.15)" : "none"}
        />
        <path
          d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
          stroke={active ? "url(#grad2)" : "#7c6fa8"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "insights",
    label: "Insights",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="12" width="4" height="9" rx="1.5"
          fill={active ? "rgba(168,85,247,0.3)" : "rgba(124,111,168,0.3)"}
          stroke={active ? "url(#grad3)" : "#7c6fa8"} strokeWidth="1.5" />
        <rect x="10" y="7" width="4" height="14" rx="1.5"
          fill={active ? "rgba(168,85,247,0.3)" : "rgba(124,111,168,0.3)"}
          stroke={active ? "url(#grad3)" : "#7c6fa8"} strokeWidth="1.5" />
        <rect x="16" y="3" width="4" height="18" rx="1.5"
          fill={active ? "rgba(168,85,247,0.3)" : "rgba(124,111,168,0.3)"}
          stroke={active ? "url(#grad3)" : "#7c6fa8"} strokeWidth="1.5" />
        <defs>
          <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3"
          stroke={active ? "url(#grad4)" : "#7c6fa8"}
          strokeWidth="2"
          fill={active ? "rgba(168,85,247,0.15)" : "none"} />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          stroke={active ? "url(#grad4)" : "#7c6fa8"}
          strokeWidth="2"
          fill="none"
        />
        <defs>
          <linearGradient id="grad4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export default function BottomNav({ active, onChange }: Props) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(13,12,20,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(168,85,247,0.1)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        zIndex: 50,
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all duration-200"
              style={{
                background: isActive ? "rgba(168,85,247,0.08)" : "transparent",
                minWidth: 64,
              }}
            >
              {tab.icon(isActive)}
              <span
                className="text-xs font-semibold tracking-wide"
                style={{
                  color: isActive ? "#a855f7" : "#7c6fa8",
                  fontSize: 10,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
