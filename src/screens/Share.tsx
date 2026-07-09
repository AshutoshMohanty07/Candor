import { useState } from "react";

function QRCode({ value }: { value: string }) {
  // Decorative QR-like pattern
  const cells = [];
  const size = 10;
  // Deterministic pseudo-random based on value
  let seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };

  const isCorner = (r: number, c: number) => {
    const inCorner = (rr: number, cc: number) =>
      rr >= 0 && rr < 3 && cc >= 0 && cc < 3;
    return (
      inCorner(r, c) ||
      inCorner(r, size - 1 - c) ||
      inCorner(size - 1 - r, c)
    );
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const corner = isCorner(r, c);
      const filled = corner || rand() > 0.45;
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * 10}
          y={r * 10}
          width={9}
          height={9}
          rx={2}
          fill={filled ? "url(#qrGrad)" : "rgba(168,85,247,0.06)"}
        />
      );
    }
  }

  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="qrGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {cells}
    </svg>
  );
}

const platforms = [
  { name: "Instagram", emoji: "📸", color: "linear-gradient(135deg, #f97316, #ec4899, #7c3aed)" },
  { name: "WhatsApp", emoji: "💬", color: "linear-gradient(135deg, #22c55e, #16a34a)" },
  { name: "Twitter/X", emoji: "🐦", color: "linear-gradient(135deg, #374151, #111827)" },
  { name: "TikTok", emoji: "🎵", color: "linear-gradient(135deg, #000, #1a1a2e)" },
  { name: "Snapchat", emoji: "👻", color: "linear-gradient(135deg, #eab308, #ca8a04)" },
  { name: "Copy link", emoji: "🔗", color: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
];

export default function Share({ username }: { username: string }) {
  const link = `candor.app/${username || "you"}`;
  const [copied, setCopied] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState("");

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatform = (name: string) => {
    if (name === "Copy link") copyLink();
    else {
      setCopiedPlatform(name);
      setTimeout(() => setCopiedPlatform(""), 2000);
    }
  };

  return (
    <div
      className="flex flex-col h-dvh overflow-y-auto"
      style={{ background: "var(--background)" }}
    >
      <div className="px-6 pt-14 pb-6">
        <h1
          className="font-extrabold mb-1"
          style={{ fontSize: 28, letterSpacing: "-0.5px", color: "var(--foreground)" }}
        >
          Share your link
        </h1>
        <p className="font-medium" style={{ color: "var(--muted-foreground)", fontSize: 14 }}>
          The more you share, the more questions you get.
        </p>
      </div>

      {/* Big link card */}
      <div className="px-4 mb-6">
        <div
          className="rounded-3xl p-6 flex flex-col items-center gap-6 card-shadow"
          style={{
            background: "linear-gradient(145deg, #1a1030 0%, #0e0a1a 100%)",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          {/* QR */}
          <div
            className="rounded-2xl p-3"
            style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.12)" }}
          >
            <QRCode value={link} />
          </div>

          {/* Link text */}
          <div className="text-center">
            <div className="gradient-text font-extrabold" style={{ fontSize: 22, letterSpacing: "-0.5px" }}>
              {link}
            </div>
            <p className="text-xs font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>
              Scan or tap to send an anonymous question
            </p>
          </div>

          {/* Copy button */}
          <button
            onClick={copyLink}
            className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95"
            style={{
              background: copied ? "rgba(34,197,94,0.15)" : "rgba(168,85,247,0.12)",
              border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(168,85,247,0.2)"}`,
              color: copied ? "#4ade80" : "#c4b5fd",
            }}
          >
            {copied ? "✓ Copied to clipboard" : "Copy link"}
          </button>
        </div>
      </div>

      {/* Share to platforms */}
      <div className="px-4 pb-8">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-4 px-1"
          style={{ color: "var(--muted-foreground)" }}
        >
          Share to
        </p>
        <div className="grid grid-cols-3 gap-3">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePlatform(p.name)}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all duration-200 active:scale-90"
              style={{
                background: copiedPlatform === p.name ? "rgba(168,85,247,0.15)" : "var(--card)",
                border: `1px solid ${copiedPlatform === p.name ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.08)"}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: p.color }}
              >
                {p.emoji}
              </div>
              <span
                className="text-xs font-bold"
                style={{
                  color: copiedPlatform === p.name ? "#a855f7" : "var(--muted-foreground)",
                  letterSpacing: 0.2,
                }}
              >
                {copiedPlatform === p.name ? "Opening..." : p.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
