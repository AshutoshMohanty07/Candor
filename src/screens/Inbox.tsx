import type { Message } from "../App";
import { useState } from "react";

type Props = {
  username: string;
  messages: Message[];
  onReply: (msg: Message) => void;
  onIgnore: (id: string) => void;
};

function MessageCard({ msg, onReply, onIgnore }: { msg: Message; onReply: () => void; onIgnore: () => void }) {
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);

  if (reported) return null;

  return (
    <div
      className="rounded-3xl p-5 flex flex-col gap-4 card-shadow transition-all duration-200"
      style={{
        background: "var(--card)",
        border: "1px solid rgba(168,85,247,0.1)",
      }}
    >
      {/* Anonymous tag + time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
          >
            👻
          </div>
          <div>
            <div className="text-xs font-bold" style={{ color: "#a855f7" }}>Anonymous</div>
            <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{msg.time}</div>
          </div>
        </div>
        {msg.replied && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}
          >
            Replied
          </span>
        )}
      </div>

      {/* Message text */}
      <p
        className="font-semibold leading-snug"
        style={{ fontSize: 17, color: "var(--foreground)", letterSpacing: "-0.2px" }}
      >
        {msg.text}
      </p>

      {/* Actions */}
      {!msg.replied && (
        <div className="flex gap-2">
          <button
            onClick={onReply}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              boxShadow: "0 4px 16px rgba(168,85,247,0.3)",
            }}
          >
            Reply ✨
          </button>
          <button
            onClick={onIgnore}
            className="py-3 px-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            Ignore
          </button>
          <button
            onClick={() => setShowReport(!showReport)}
            className="py-3 px-3 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{ background: "var(--muted)", color: "#f87171" }}
          >
            ⚑
          </button>
        </div>
      )}

      {showReport && !msg.replied && (
        <div
          className="rounded-2xl p-3 flex items-center justify-between"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
        >
          <span className="text-sm font-semibold" style={{ color: "#f87171" }}>
            Report this message?
          </span>
          <button
            onClick={() => setReported(true)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{ background: "#f87171", color: "#fff" }}
          >
            Report
          </button>
        </div>
      )}
    </div>
  );
}

export default function Inbox({ username, messages, onReply, onIgnore }: Props) {
  const unread = messages.filter((m) => !m.replied).length;

  return (
    <div className="flex flex-col h-dvh overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 pt-14 pb-4"
        style={{ background: "var(--background)" }}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1
              className="font-extrabold leading-none"
              style={{ fontSize: 28, letterSpacing: "-0.5px", color: "var(--foreground)" }}
            >
              Inbox
            </h1>
            {username && (
              <p className="text-sm font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>
                {window.location.origin}/{username}
              </p>
            )}
          </div>
          {unread > 0 && (
            <div
              className="flex items-center justify-center rounded-full font-bold text-white text-sm min-w-[28px] h-7"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", paddingInline: 10 }}
            >
              {unread}
            </div>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ paddingBottom: 24 }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
            <div style={{ fontSize: 56 }}>📭</div>
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: "var(--foreground)" }}>No messages yet</p>
              <p className="text-sm font-medium mt-1" style={{ color: "var(--muted-foreground)" }}>
                Share your link to start getting anonymous questions
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <MessageCard
                key={msg.id}
                msg={msg}
                onReply={() => onReply(msg)}
                onIgnore={() => onIgnore(msg.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
