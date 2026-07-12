import { useState } from "react";
import type { Screen } from "../App";

type Props = {
  onNavigate?: (s: Screen) => void;
  username: string;
  onDeleteAccount: () => Promise<void>;
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="transition-all duration-200"
      style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        background: checked ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "rgba(168,85,247,0.15)",
        position: "relative",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <div
        className="absolute top-1 transition-all duration-200"
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          background: "#fff",
          left: checked ? 24 : 4,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

function SettingRow({ icon, label, sub, right }: { icon: string; label: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background: "rgba(168,85,247,0.1)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{label}</p>
        {sub && <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export default function Settings({ onNavigate, username, onDeleteAccount }: Props) {
  const [notifs, setNotifs] = useState(true);
  const [filter, setFilter] = useState(true);
  const [sound, setSound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Use the real origin so this works on any domain (local, Render, custom, etc.)
  const candorLink = `${window.location.origin}/${username || "you"}`;

  const copyLink = () => {
    navigator.clipboard.writeText(candorLink).catch(() => {
      // Fallback for browsers that block clipboard access
      const el = document.createElement("textarea");
      el.value = candorLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await onDeleteAccount();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete account.");
      setDeleting(false);
    }
  };

  return (
    <div
      className="flex flex-col h-dvh overflow-y-auto"
      style={{ background: "var(--background)" }}
    >
      {/* Header */}
      <div className="px-6 pt-14 pb-2 flex-shrink-0">
        <h1
          className="font-extrabold mb-1"
          style={{ fontSize: 28, letterSpacing: "-0.5px", color: "var(--foreground)" }}
        >
          Settings
        </h1>
      </div>

      <div className="px-4 pb-10 flex flex-col gap-4">
        {/* Profile section */}
        <div
          className="rounded-2xl px-4 py-2"
          style={{ background: "var(--card)", border: "1px solid rgba(168,85,247,0.1)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest pt-3 pb-1" style={{ color: "var(--muted-foreground)" }}>
            Profile
          </p>
          <SettingRow
            icon="✏️"
            label="Edit username"
            sub={`${window.location.host}/${username || "you"}`}
            right={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#7c6fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <div style={{ height: 1, background: "var(--border)" }} />
          <button className="flex items-center gap-3 py-3.5 w-full text-left" onClick={copyLink}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: "rgba(168,85,247,0.1)" }}
            >
              🔗
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>My Candor link</p>
              <p className="text-xs font-medium" style={{ color: copied ? "#4ade80" : "var(--muted-foreground)" }}>
                {copied ? "✓ Copied to clipboard" : "Tap to copy"}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#7c6fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Notifications */}
        <div
          className="rounded-2xl px-4 py-2"
          style={{ background: "var(--card)", border: "1px solid rgba(168,85,247,0.1)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest pt-3 pb-1" style={{ color: "var(--muted-foreground)" }}>
            Notifications
          </p>
          <SettingRow
            icon="🔔"
            label="Push notifications"
            sub="New message alerts"
            right={<Toggle checked={notifs} onChange={() => setNotifs(!notifs)} />}
          />
          <div style={{ height: 1, background: "var(--border)" }} />
          <SettingRow
            icon="🔊"
            label="Notification sounds"
            sub="Play a sound on new message"
            right={<Toggle checked={sound} onChange={() => setSound(!sound)} />}
          />
        </div>

        {/* Moderation */}
        <div
          className="rounded-2xl px-4 py-2"
          style={{ background: "var(--card)", border: "1px solid rgba(168,85,247,0.1)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest pt-3 pb-1" style={{ color: "var(--muted-foreground)" }}>
            Moderation
          </p>
          <SettingRow
            icon="🛡️"
            label="Content filter"
            sub="Auto-hide harmful messages"
            right={<Toggle checked={filter} onChange={() => setFilter(!filter)} />}
          />
        </div>

        {/* About */}
        <div
          className="rounded-2xl px-4 py-2"
          style={{ background: "var(--card)", border: "1px solid rgba(168,85,247,0.1)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest pt-3 pb-1" style={{ color: "var(--muted-foreground)" }}>
            About
          </p>
          <button
            className="flex items-center gap-3 py-3.5 w-full text-left"
            onClick={() => onNavigate?.("privacy")}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: "rgba(168,85,247,0.1)" }}
            >
              📄
            </div>
            <p className="flex-1 font-semibold text-sm" style={{ color: "var(--foreground)" }}>Privacy policy</p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#7c6fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{ height: 1, background: "var(--border)" }} />
          <button
            className="flex items-center gap-3 py-3.5 w-full text-left"
            onClick={() => onNavigate?.("terms")}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: "rgba(168,85,247,0.1)" }}
            >
              📋
            </div>
            <p className="flex-1 font-semibold text-sm" style={{ color: "var(--foreground)" }}>Terms of service</p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#7c6fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div style={{ height: 1, background: "var(--border)" }} />
          <SettingRow icon="ℹ️" label="Version 1.0.0" sub="Up to date" />
        </div>

        {/* Danger zone */}
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
          style={{
            background: "rgba(248,113,113,0.07)",
            border: "1px solid rgba(248,113,113,0.15)",
            color: "#f87171",
            opacity: deleting ? 0.6 : 1,
            cursor: deleting ? "not-allowed" : "pointer",
          }}
        >
          {deleting ? "Deleting…" : "Delete account"}
        </button>
      </div>
    </div>
  );
}
