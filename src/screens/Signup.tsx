import { useState } from "react";

export default function Signup({ onDone }: { onDone: (username: string) => void }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
  const isValid = clean.length >= 3;

  const handleSubmit = () => {
    if (!isValid) {
      setError("Username must be at least 3 characters.");
      return;
    }
    onDone(clean);
  };

  return (
    <div
      className="flex flex-col h-dvh relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 260px 260px at 50% 20%, rgba(168,85,247,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="flex flex-col px-6 pt-16 flex-1 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div
            className="font-extrabold mb-2"
            style={{ fontSize: 13, letterSpacing: 3, color: "#a855f7", textTransform: "uppercase" }}
          >
            Step 1 of 1
          </div>
          <h1
            className="font-extrabold leading-tight"
            style={{ fontSize: 32, color: "var(--foreground)", letterSpacing: "-0.5px" }}
          >
            Claim your{"\n"}
            <span className="gradient-text">Candor link.</span>
          </h1>
          <p className="mt-3 font-medium" style={{ color: "var(--muted-foreground)", fontSize: 15 }}>
            This is how friends find you. Keep it simple and memorable.
          </p>
        </div>

        {/* Input group */}
        <div className="flex flex-col gap-3 mb-4">
          <div
            className="rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              background: "var(--card)",
              border: `1.5px solid ${focused ? "#a855f7" : "rgba(168,85,247,0.15)"}`,
              boxShadow: focused ? "0 0 0 3px rgba(168,85,247,0.15)" : "none",
            }}
          >
            {/* URL prefix */}
            <div
              className="px-4 pt-3 pb-1 font-semibold"
              style={{ fontSize: 12, color: "var(--muted-foreground)", letterSpacing: 0.3 }}
            >
              candor.app/
            </div>
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="yourname"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full px-4 pb-4 font-bold outline-none bg-transparent"
              style={{
                fontSize: 28,
                color: "var(--foreground)",
                letterSpacing: "-0.5px",
              }}
            />
          </div>

          {/* Live preview */}
          {clean.length > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: "rgba(168,85,247,0.08)" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
              />
              <span className="text-sm font-semibold" style={{ color: "#c4b5fd" }}>
                candor.app/{clean}
              </span>
              <span className="text-xs ml-auto font-medium" style={{ color: "#a855f7" }}>
                ✓ available
              </span>
            </div>
          )}

          {error && (
            <p className="text-sm font-semibold px-1" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}
        </div>

        {/* Tips */}
        <div className="flex flex-col gap-2">
          {["Use your first name or nickname", "Letters, numbers, and underscores only", "You can change this later"].map((tip) => (
            <div key={tip} className="flex items-center gap-2">
              <span style={{ color: "#a855f7", fontSize: 14 }}>·</span>
              <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-12 relative z-10">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-200 active:scale-95"
          style={{
            background: isValid
              ? "linear-gradient(135deg, #7c3aed, #ec4899)"
              : "rgba(168,85,247,0.15)",
            color: isValid ? "#fff" : "#7c6fa8",
            boxShadow: isValid ? "0 8px 24px rgba(168,85,247,0.35)" : "none",
            fontSize: 17,
            letterSpacing: "-0.2px",
          }}
        >
          Create my link →
        </button>
      </div>
    </div>
  );
}
