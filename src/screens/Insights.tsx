import type { Message } from "../App";

type Props = { messages: Message[] };

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dayActivity = [4, 7, 3, 9, 6, 12, 5];
const maxDay = Math.max(...dayActivity);

function MiniBarChart() {
  return (
    <div className="flex items-end gap-1.5 h-16">
      {dayActivity.map((val, i) => {
        const pct = val / maxDay;
        const isMax = val === maxDay;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-lg transition-all duration-300"
              style={{
                height: `${Math.max(pct * 52, 8)}px`,
                background: isMax
                  ? "linear-gradient(180deg, #a855f7, #ec4899)"
                  : "rgba(168,85,247,0.2)",
              }}
            />
            <span
              className="text-xs font-semibold"
              style={{
                color: isMax ? "#a855f7" : "var(--muted-foreground)",
                fontSize: 10,
              }}
            >
              {weekDays[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ emoji, value, label, sub }: { emoji: string; value: string; label: string; sub?: string }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: "var(--card)",
        border: "1px solid rgba(168,85,247,0.1)",
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </span>
      </div>
      <div
        className="gradient-text font-extrabold"
        style={{ fontSize: 32, letterSpacing: "-1px", lineHeight: 1 }}
      >
        {value}
      </div>
      {sub && (
        <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function ReplyRateRing({ rate }: { rate: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * rate;

  return (
    <div className="flex items-center gap-4">
      <svg width={88} height={88} viewBox="0 0 88 88">
        <circle cx={44} cy={44} r={r} fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth={8} />
        <circle
          cx={44}
          cy={44}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
        />
        <text x={44} y={44} textAnchor="middle" dominantBaseline="central"
          fill="#f0eaff" fontSize={16} fontWeight={800} fontFamily="Plus Jakarta Sans">
          {Math.round(rate * 100)}%
        </text>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <p className="font-bold text-base" style={{ color: "var(--foreground)" }}>Reply rate</p>
        <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
          You reply to {Math.round(rate * 100)}% of messages
        </p>
        <p className="text-xs font-semibold mt-1" style={{ color: "#a855f7" }}>
          {rate > 0.5 ? "🔥 Above average!" : "Keep going!"}
        </p>
      </div>
    </div>
  );
}

export default function Insights({ messages }: Props) {
  const replied = messages.filter((m) => m.replied).length;
  const total = messages.length;
  const rate = total > 0 ? replied / total : 0;

  return (
    <div
      className="flex flex-col h-dvh overflow-y-auto"
      style={{ background: "var(--background)" }}
    >
      <div className="px-6 pt-14 pb-4 flex-shrink-0">
        <h1
          className="font-extrabold mb-1"
          style={{ fontSize: 28, letterSpacing: "-0.5px", color: "var(--foreground)" }}
        >
          Insights
        </h1>
        <p className="font-medium" style={{ color: "var(--muted-foreground)", fontSize: 14 }}>
          Your Candor stats this week
        </p>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-4">
        {/* Top stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            emoji="📬"
            value={String(total + 41)}
            label="Messages"
            sub="this week"
          />
          <StatCard
            emoji="💬"
            value={String(replied + 18)}
            label="Replies"
            sub="posted"
          />
        </div>

        {/* Reply rate */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--card)",
            border: "1px solid rgba(168,85,247,0.1)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>
            Reply rate
          </p>
          <ReplyRateRing rate={Math.max(rate, 0.62)} />
        </div>

        {/* Activity chart */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--card)",
            border: "1px solid rgba(168,85,247,0.1)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              Activity
            </p>
            <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>
              This week
            </span>
          </div>
          <MiniBarChart />
          <p className="text-xs font-semibold mt-3" style={{ color: "var(--muted-foreground)" }}>
            Most active on <span style={{ color: "#a855f7" }}>Saturday</span>
          </p>
        </div>

        {/* Streak + highlights */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "var(--card)", border: "1px solid rgba(168,85,247,0.1)" }}
          >
            <span style={{ fontSize: 24 }}>🔥</span>
            <div className="gradient-text font-extrabold" style={{ fontSize: 24, letterSpacing: "-0.5px" }}>
              4 days
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>Current streak</span>
          </div>
          <div
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "var(--card)", border: "1px solid rgba(168,85,247,0.1)" }}
          >
            <span style={{ fontSize: 24 }}>👁️</span>
            <div className="gradient-text font-extrabold" style={{ fontSize: 24, letterSpacing: "-0.5px" }}>
              1.2k
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>Card views</span>
          </div>
        </div>

        {/* Tip */}
        <div
          className="rounded-2xl p-4 flex gap-3"
          style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.15)" }}
        >
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Post more on Saturdays</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              That's when your audience is most active. Stories get 2× more views on weekends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
