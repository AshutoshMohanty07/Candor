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

// Inline SVG brand icons — official marks and colors
const BrandIcon = ({ name }: { name: string }) => {
  if (name === "Instagram") return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="white" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8"/>
      <circle cx="17.5" cy="6.5" r="1.1" fill="white"/>
    </svg>
  );
  if (name === "WhatsApp") return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.41A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm5.094 13.538c-.214.601-1.257 1.148-1.716 1.18-.46.033-.473.353-2.981-.697-2.508-1.05-3.994-3.63-4.115-3.798-.12-.169-.978-1.37-.924-2.58.054-1.21.677-1.787.917-2.032.24-.244.521-.305.695-.308.173-.002.346.002.498.009.16.008.374-.06.584.497.21.558.714 1.925.776 2.063.062.139.102.3.01.482-.09.183-.136.297-.27.457-.135.16-.284.357-.405.48-.134.135-.274.282-.118.553.157.27.694 1.212 1.49 1.963 1.024.966 1.887 1.264 2.157 1.404.27.14.428.117.587-.07.16-.188.683-.796.866-1.068.182-.272.365-.227.614-.136.25.09 1.588.81 1.861.958.274.147.456.22.523.342.067.12.067.695-.147 1.296Z"/>
    </svg>
  );
  if (name === "Twitter/X") return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.94l4.265 5.633 4.79-5.633Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
    </svg>
  );
  if (name === "TikTok") return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z"/>
    </svg>
  );
  if (name === "Snapchat") return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.007 2c-1.512 0-4.29.47-5.57 3.33-.41.93-.32 2.52-.24 3.62l.02.22c-.33.17-.75.13-1.01.06-.32-.08-.64-.02-.87.17a.97.97 0 0 0-.32.73c-.02.5.35.87.76 1.06.14.07.49.19.93.32-.12.25-.3.52-.6.77-.56.47-1.36.76-2.1.76a.75.75 0 0 0-.75.75c0 .41.34.75.75.75.09 0 2.19.26 3 2.09.02.05.03.08.03.08l.02.03c.13.28.43.45.74.41.1-.01 1.08-.12 2.26.48.98.5 1.56 1.43 1.59 1.49.2.35.57.55.97.51.07-.01.13-.02.2-.03.81-.16 1.79-.67 3.06-.67 1.27 0 2.2.49 3.01.66.09.02.17.03.24.03.38 0 .73-.2.93-.53.03-.06.61-.98 1.6-1.48 1.18-.6 2.17-.49 2.26-.47.41.04.79-.14.92-.51l.02-.05c0-.01.01-.03.02-.04.82-1.84 2.92-2.1 3.01-2.11a.75.75 0 0 0 .65-.75.75.75 0 0 0-.75-.75c-.74 0-1.54-.29-2.1-.76-.31-.25-.49-.53-.61-.78.44-.13.79-.25.93-.32.41-.19.78-.56.76-1.06a.97.97 0 0 0-.32-.73c-.23-.19-.55-.25-.87-.17-.26.07-.68.11-1.01-.06l.02-.22c.08-1.1.17-2.69-.24-3.62C16.298 2.47 13.519 2 12.007 2Z"/>
    </svg>
  );
  // Copy link
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
};

const platforms = [
  { name: "Instagram", color: "linear-gradient(135deg, #f97316, #ec4899, #7c3aed)" },
  { name: "WhatsApp", color: "#25D366" },
  { name: "Twitter/X", color: "#000000" },
  { name: "TikTok", color: "#010101" },
  { name: "Snapchat", color: "#FFFC00" },
  { name: "Copy link", color: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
];

export default function Share({ username }: { username: string }) {
  // Use the real origin so this works on any domain (local, Render, custom, etc.)
  const shareUrl = `${window.location.origin}/${username || "you"}`;
  const [copied, setCopied] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState("");

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {
      // Fallback for browsers that block clipboard access
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
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
            <QRCode value={shareUrl} />
          </div>

          {/* Link text */}
          <div className="text-center">
            <div className="gradient-text font-extrabold" style={{ fontSize: 22, letterSpacing: "-0.5px" }}>
              {shareUrl}
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
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: p.color,
                  // Snapchat is yellow — invert the white icon to black so it's legible
                  filter: p.name === "Snapchat" ? "invert(1)" : "none",
                }}
              >
                <BrandIcon name={p.name} />
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
