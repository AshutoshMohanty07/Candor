import { useEffect, useState } from "react";
import { api } from "../api";

type Props = { username: string };

type InsightsData = {
  total: number;
  replied: number;
  reply_rate: number;
  messages_this_week: number;
  most_active_day: string | null;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  emoji,
  value,
  label,
  sub,
}: {
  emoji: string;
  value: string;
  label: string;
  sub?: string;
}) {
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
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
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
        <span
          className="text-xs font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

function ComingSoonCard({
  emoji,
  label,
}: {
  emoji: string;
  label: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: "var(--card)",
        border: "1px solid rgba(168,85,247,0.08)",
        opacity: 0.6,
      }}
    >
      <span style={{ fontSize: 24 }}>{emoji}</span>
      <div
        className="font-extrabold"
        style={{
          fontSize: 14,
          letterSpacing: "-0.2px",
          color: "var(--muted-foreground)",
        }}
      >
        Coming soon
      </div>
      <span
        className="text-xs font-semibold"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </span>
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
        <circle
          cx={44}
          cy={44}
          r={r}
          fill="none"
          stroke="rgba(168,85,247,0.1)"
          strokeWidth={8}
        />
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
        <text
          x={44}
          y={44}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#f0eaff"
          fontSize={16}
          fontWeight={800}
          fontFamily="Plus Jakarta Sans"
        >
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
        <p
          className="font-bold text-base"
          style={{ color: "var(--foreground)" }}
        >
          Reply rate
        </p>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          You reply to {Math.round(rate * 100)}% of messages
        </p>
        <p
          className="text-xs font-semibold mt-1"
          style={{ color: "#a855f7" }}
        >
          {rate > 0.5 ? "🔥 Above average!" : "Keep going!"}
        </p>
      </div>
    </div>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function Insights({ username }: Props) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .getInsights(username)
      .then(setData)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Could not load insights."
        );
      })
      .finally(() => setLoading(false));
  }, [username]);

  return (
    <div
      className="flex flex-col h-dvh overflow-y-auto"
      style={{ background: "var(--background)" }}
    >
      <div className="px-6 pt-14 pb-4 flex-shrink-0">
        <h1
          className="font-extrabold mb-1"
          style={{
            fontSize: 28,
            letterSpacing: "-0.5px",
            color: "var(--foreground)",
          }}
        >
          Insights
        </h1>
        <p
          className="font-medium"
          style={{ color: "var(--muted-foreground)", fontSize: 14 }}
        >
          Your Candor stats
        </p>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-4">
        {loading && (
          <div
            className="rounded-2xl p-8 flex items-center justify-center"
            style={{
              background: "var(--card)",
              border: "1px solid rgba(168,85,247,0.1)",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--muted-foreground)" }}
            >
              Loading…
            </p>
          </div>
        )}

        {error && !loading && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#f87171" }}>
              {error}
            </p>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Top stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                emoji="📬"
                value={String(data.messages_this_week)}
                label="Messages"
                sub="this week"
              />
              <StatCard
                emoji="📨"
                value={String(data.total)}
                label="Total"
                sub="all time"
              />
            </div>

            {/* Reply rate ring */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "var(--card)",
                border: "1px solid rgba(168,85,247,0.1)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--muted-foreground)" }}
              >
                Reply rate
              </p>
              <ReplyRateRing rate={data.reply_rate} />
            </div>

            {/* Replies + most active day */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                emoji="💬"
                value={String(data.replied)}
                label="Replies"
                sub="posted"
              />
              {data.most_active_day ? (
                <div
                  className="rounded-2xl p-4 flex flex-col gap-2"
                  style={{
                    background: "var(--card)",
                    border: "1px solid rgba(168,85,247,0.1)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 20 }}>📅</span>
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Peak day
                    </span>
                  </div>
                  <div
                    className="gradient-text font-extrabold"
                    style={{
                      fontSize: 20,
                      letterSpacing: "-0.5px",
                      lineHeight: 1.2,
                    }}
                  >
                    {data.most_active_day}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    most messages
                  </span>
                </div>
              ) : (
                <div
                  className="rounded-2xl p-4 flex flex-col gap-2"
                  style={{
                    background: "var(--card)",
                    border: "1px solid rgba(168,85,247,0.08)",
                    opacity: 0.6,
                  }}
                >
                  <span style={{ fontSize: 20 }}>📅</span>
                  <div
                    className="font-extrabold"
                    style={{
                      fontSize: 14,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    No data yet
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Peak day
                  </span>
                </div>
              )}
            </div>

            {/* Coming soon: streak + card views */}
            <div className="grid grid-cols-2 gap-3">
              <ComingSoonCard emoji="🔥" label="Current streak" />
              <ComingSoonCard emoji="👁️" label="Card views" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
