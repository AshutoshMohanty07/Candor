import { useState } from "react";
import type { Message } from "../App";

type Props = {
  message: Message;
  username: string;
  onBack: () => void;
  onSubmit: (id: string, replyText: string) => void;
};

function ShareCard({ question, reply, username }: { question: string; reply: string; username: string }) {
  return (
    <div
      className="rounded-3xl p-6 flex flex-col gap-5 w-full"
      style={{
        background: "linear-gradient(145deg, #1a1030 0%, #0e0a1a 100%)",
        border: "1px solid rgba(168,85,247,0.25)",
        boxShadow: "0 8px 40px rgba(120,50,230,0.25)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
        >
          C
        </div>
        <span className="text-xs font-bold" style={{ color: "#7c6fa8" }}>
          candor.app/{username || "you"}
        </span>
      </div>

      {/* Question */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.12)" }}
      >
        <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "#a855f7" }}>
          👻 Anonymous asked
        </div>
        <p className="font-semibold leading-snug" style={{ fontSize: 15, color: "#e2d9f3" }}>
          {question}
        </p>
      </div>

      {/* Reply */}
      <div>
        <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "#ec4899" }}>
          My answer
        </div>
        <p
          className="font-bold leading-snug"
          style={{ fontSize: 18, color: "#f0eaff", letterSpacing: "-0.3px" }}
        >
          {reply || "..."}
        </p>
      </div>

      {/* Footer gradient line */}
      <div
        className="h-0.5 rounded-full"
        style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899, transparent)" }}
      />
    </div>
  );
}

export default function Reply({ message, username, onBack, onSubmit }: Props) {
  const [reply, setReply] = useState("");
  const [preview, setPreview] = useState(false);
  const maxLen = 280;

  return (
    <div
      className="flex flex-col h-dvh overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-14 pb-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: "var(--muted)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 className="font-extrabold" style={{ fontSize: 20, letterSpacing: "-0.3px" }}>
            Write a reply
          </h1>
          <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
            This will be posted as a public card
          </p>
        </div>

        <div className="ml-auto flex gap-1">
          <button
            onClick={() => setPreview(false)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
            style={{
              background: !preview ? "rgba(168,85,247,0.15)" : "transparent",
              color: !preview ? "#a855f7" : "var(--muted-foreground)",
            }}
          >
            Write
          </button>
          <button
            onClick={() => setPreview(true)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
            style={{
              background: preview ? "rgba(168,85,247,0.15)" : "transparent",
              color: preview ? "#a855f7" : "var(--muted-foreground)",
            }}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {/* Original question */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.12)" }}
        >
          <div className="text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: "#a855f7" }}>
            👻 They asked
          </div>
          <p className="font-semibold leading-snug" style={{ fontSize: 15, color: "var(--foreground)" }}>
            {message.text}
          </p>
        </div>

        {!preview ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value.slice(0, maxLen))}
              placeholder="Write your honest answer here..."
              className="w-full rounded-2xl p-4 font-semibold resize-none outline-none transition-all duration-200"
              style={{
                background: "var(--card)",
                border: `1.5px solid ${reply ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.1)"}`,
                color: "var(--foreground)",
                fontSize: 16,
                lineHeight: 1.5,
                minHeight: 140,
              }}
              rows={5}
              autoFocus
            />
            <div className="flex justify-end">
              <span
                className="text-xs font-bold"
                style={{ color: reply.length > maxLen * 0.85 ? "#f97316" : "var(--muted-foreground)" }}
              >
                {reply.length}/{maxLen}
              </span>
            </div>
          </div>
        ) : (
          <ShareCard question={message.text} reply={reply} username={username} />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-12 pt-3 flex-shrink-0 flex flex-col gap-2">
        <button
          onClick={() => onSubmit(message.id, reply)}
          disabled={reply.trim().length < 1}
          className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-200 active:scale-95"
          style={{
            background:
              reply.trim().length > 0
                ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                : "rgba(168,85,247,0.15)",
            color: reply.trim().length > 0 ? "#fff" : "#7c6fa8",
            boxShadow: reply.trim().length > 0 ? "0 8px 24px rgba(168,85,247,0.35)" : "none",
            fontSize: 17,
          }}
        >
          Post reply & share card 🚀
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
          style={{ color: "var(--muted-foreground)" }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
