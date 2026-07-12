// api.ts — every network call the app makes lives here, so App.tsx and the
// screens stay focused on UI instead of fetch() boilerplate.
//
// In development, set VITE_API_URL in a .env file (e.g. http://localhost:8000)
// In production (single Repl serving both frontend + backend), leave it
// blank — requests will just go to the same origin the app is served from.

const BASE = import.meta.env.VITE_API_URL || "";

// The owner token is stored in localStorage after signup and sent on every
// authenticated request as X-Owner-Token. The backend validates it and
// rejects requests where the token doesn't match the resource being accessed.
export const STORAGE_TOKEN_KEY = "candor_owner_token";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Owner-Token"] = token;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export type ApiMessage = {
  id: string;
  text: string;
  time: string;
  replied: boolean;
};

export const api = {
  checkUserExists: (username: string) =>
    request<{ exists: boolean }>(`/api/users/${username}`),

  // Returns username + owner_token (only returned once — store it immediately)
  createUser: (username: string) =>
    request<{ username: string; owner_token: string }>(`/api/users`, {
      method: "POST",
      body: JSON.stringify({ username }),
    }),

  sendMessage: (recipientUsername: string, content: string) =>
    request<{ status: string }>(`/api/messages`, {
      method: "POST",
      body: JSON.stringify({ recipient_username: recipientUsername, content }),
    }),

  getInbox: (username: string) =>
    request<{ messages: ApiMessage[] }>(`/api/messages/${username}`),

  ignoreMessage: (id: string) =>
    request<{ status: string }>(`/api/messages/${id}/ignore`, { method: "POST" }),

  reportMessage: (id: string) =>
    request<{ status: string }>(`/api/messages/${id}/report`, { method: "POST" }),

  replyToMessage: (id: string, replyContent: string, isPublic = true) =>
    request<{ status: string }>(`/api/messages/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ reply_content: replyContent, is_public: isPublic }),
    }),

  deleteAccount: (username: string) =>
    request<{ status: string }>(`/api/users/${username}`, { method: "DELETE" }),

  getInsights: (username: string) =>
    request<{
      total: number;
      replied: number;
      reply_rate: number;
      messages_this_week: number;
      most_active_day: string | null;
    }>(`/api/insights/${username}`),
};
