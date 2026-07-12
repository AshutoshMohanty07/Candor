import { useEffect, useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Onboarding from "./screens/Onboarding";
import Signup from "./screens/Signup";
import Inbox from "./screens/Inbox";
import Reply from "./screens/Reply";
import Share from "./screens/Share";
import Insights from "./screens/Insights";
import Settings from "./screens/Settings";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import TermsOfService from "./screens/TermsOfService";
import SendMessage from "./screens/SendMessage";
import BottomNav from "./components/BottomNav";
import { api, STORAGE_TOKEN_KEY, type ApiMessage } from "./api";

export type Screen =
  | "onboarding"
  | "signup"
  | "inbox"
  | "reply"
  | "share"
  | "insights"
  | "settings"
  | "privacy"
  | "terms";

// Message shape now comes straight from the API (see api.ts)
export type Message = ApiMessage;

const STORAGE_KEY = "candor_username";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center min-h-dvh" style={{ background: "#050508" }}>
      <div
        className="relative w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 390, minHeight: "100dvh", background: "var(--background)" }}
      >
        {children}
      </div>
    </div>
  );
}

function OwnerApp() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState<"inbox" | "share" | "insights" | "settings">("inbox");
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const mainScreens: Screen[] = ["inbox", "share", "insights", "settings"];
  const isMainApp = mainScreens.includes(screen);

  // On first load, check if this browser already has a Candor account.
  // This is a simple "session" — good enough for a portfolio MVP. A real
  // production app would use proper auth (cookies/JWT) instead of
  // trusting localStorage, but that's a deliberate scope cut here.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setUsername(saved);
      loadInbox(saved).finally(() => {
        setScreen("inbox");
        setActiveTab("inbox");
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInbox = async (uname: string) => {
    try {
      const res = await api.getInbox(uname);
      setMessages(res.messages);
    } catch {
      // If the backend is unreachable, fail quietly to an empty inbox
      // instead of crashing the whole app.
      setMessages([]);
    }
  };

  const navigateTo = (s: Screen) => {
    setScreen(s);
    if (mainScreens.includes(s)) {
      setActiveTab(s as typeof activeTab);
    }
  };

  const handleTabChange = (tab: "inbox" | "share" | "insights" | "settings") => {
    setActiveTab(tab);
    setScreen(tab);
    if (tab === "inbox") loadInbox(username);
  };

  const handleSignupDone = async (uname: string) => {
    try {
      const res = await api.createUser(uname);
      localStorage.setItem(STORAGE_KEY, uname);
      localStorage.setItem(STORAGE_TOKEN_KEY, res.owner_token);
      setUsername(uname);
      setScreen("inbox");
      setActiveTab("inbox");
      loadInbox(uname);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Signup failed. Try a different username.");
    }
  };

  const handleDeleteAccount = async () => {
    await api.deleteAccount(username);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUsername("");
    setMessages([]);
    setScreen("onboarding");
  };

  const handleReply = (msg: Message) => {
    setReplyMessage(msg);
    setScreen("reply");
  };

  const handleIgnore = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      await api.ignoreMessage(id);
    } catch {
      // Non-critical — worst case it reappears next time the inbox reloads.
    }
  };

  const handleReplySubmit = async (id: string, replyText: string) => {
    try {
      await api.replyToMessage(id, replyText);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, replied: true } : m)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to post reply.");
    }
    setScreen("inbox");
    setActiveTab("inbox");
  };

  if (loading) return null;

  return (
    <PhoneFrame>
      {screen === "onboarding" && <Onboarding onDone={() => setScreen("signup")} />}
      {screen === "signup" && <Signup onDone={handleSignupDone} />}
      {screen === "inbox" && (
        <Inbox
          username={username}
          messages={messages}
          onReply={handleReply}
          onIgnore={handleIgnore}
        />
      )}
      {screen === "reply" && replyMessage && (
        <Reply
          message={replyMessage}
          username={username}
          onBack={() => {
            setScreen("inbox");
            setActiveTab("inbox");
          }}
          onSubmit={handleReplySubmit}
        />
      )}
      {screen === "share" && <Share username={username} />}
      {screen === "insights" && <Insights username={username} />}
      {screen === "settings" && (
        <Settings
          onNavigate={navigateTo}
          username={username}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
      {screen === "privacy" && <PrivacyPolicy onBack={() => setScreen("settings")} />}
      {screen === "terms" && <TermsOfService onBack={() => setScreen("settings")} />}

      {isMainApp && screen !== "reply" && (
        <BottomNav active={activeTab} onChange={handleTabChange} />
      )}
    </PhoneFrame>
  );
}

function PublicSendPage() {
  const { username } = useParams<{ username: string }>();
  return (
    <PhoneFrame>
      <SendMessage username={username ?? ""} />
    </PhoneFrame>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Owner's app: onboarding, signup, inbox, replies, insights, settings */}
      <Route path="/" element={<OwnerApp />} />
      {/* Public link anyone can visit to send an anonymous message, e.g. candor.app/ashutosh */}
      <Route path="/:username" element={<PublicSendPage />} />
    </Routes>
  );
}
