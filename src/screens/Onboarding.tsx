import { useState } from "react";

const slides = [
  {
    emoji: "🎭",
    title: "Ask anything,\nanonymously.",
    body: "Share your Candor link and let your friends send you raw, honest questions — no name, no trace.",
    accent: "linear-gradient(135deg, #7c3aed, #a855f7)",
  },
  {
    emoji: "💬",
    title: "Reply when\nyou feel it.",
    body: "Pick the messages that spark you. Write a reply and it turns into a beautiful shareable card.",
    accent: "linear-gradient(135deg, #a855f7, #ec4899)",
  },
  {
    emoji: "✨",
    title: "Your honesty,\nyour audience.",
    body: "Post replies to Instagram, WhatsApp, or wherever. Candor turns real moments into content.",
    accent: "linear-gradient(135deg, #ec4899, #f97316)",
  },
];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0);
  const current = slides[slide];

  const next = () => {
    if (slide < slides.length - 1) setSlide(slide + 1);
    else onDone();
  };

  return (
    <div
      className="flex flex-col h-dvh relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 280px 280px at 50% 30%, rgba(168,85,247,0.18) 0%, transparent 70%)`,
          transition: "all 0.6s ease",
        }}
      />

      {/* Skip */}
      <div className="flex justify-end px-6 pt-14 pb-0 relative z-10">
        <button
          onClick={onDone}
          className="text-sm font-semibold"
          style={{ color: "var(--muted-foreground)" }}
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 px-8 gap-8 relative z-10">
        {/* Emoji orb */}
        <div
          className="flex items-center justify-center rounded-3xl transition-all duration-500"
          style={{
            width: 120,
            height: 120,
            background: current.accent,
            boxShadow: "0 20px 60px rgba(168,85,247,0.4)",
            fontSize: 56,
          }}
        >
          {current.emoji}
        </div>

        {/* Text */}
        <div className="text-center flex flex-col gap-4">
          <h1
            className="font-extrabold leading-tight"
            style={{
              fontSize: 34,
              color: "var(--foreground)",
              whiteSpace: "pre-line",
              letterSpacing: "-0.5px",
            }}
          >
            {current.title}
          </h1>
          <p
            className="text-base leading-relaxed font-medium"
            style={{ color: "var(--muted-foreground)", maxWidth: 280 }}
          >
            {current.body}
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-12 flex flex-col gap-6 relative z-10">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: i === slide ? "#a855f7" : "rgba(168,85,247,0.25)",
                transition: "all 0.3s ease",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-200 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            boxShadow: "0 8px 24px rgba(168,85,247,0.4)",
            fontSize: 17,
            letterSpacing: "-0.2px",
          }}
        >
          {slide < slides.length - 1 ? "Next" : "Get Started →"}
        </button>
      </div>
    </div>
  );
}
