"use client";

import { FormEvent, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function getVisitorId() {
  const existing = window.localStorage.getItem("visitor_id");
  if (existing) {
    return existing;
  }

  const created = crypto.randomUUID();
  window.localStorage.setItem("visitor_id", created);
  return created;
}

function getSessionId() {
  const existing = window.sessionStorage.getItem("session_id");
  if (existing) {
    return existing;
  }

  const created = crypto.randomUUID();
  window.sessionStorage.setItem("session_id", created);
  return created;
}

async function trackEvent(eventName: string) {
  await fetch(`${API_BASE_URL}/track/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      event_name: eventName,
      page_path: window.location.pathname,
    }),
  }).catch(() => undefined);
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好，我可以介绍站长、项目经历和合作方向。",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = prompt.trim();

    if (!trimmed || loading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setPrompt("");
    setLoading(true);
    await trackEvent("chat_message");

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_id: getVisitorId(),
          session_id: getSessionId(),
          source_page: window.location.pathname,
          message: trimmed,
        }),
      });

      const data = (await response.json()) as { answer: string };
      setMessages([...nextMessages, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "聊天服务暂时不可用，请稍后再试。" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function onToggle() {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      await trackEvent("chat_open");
    }
  }

  return (
    <div className="chat-shell">
      <button className="chat-toggle" onClick={onToggle} type="button">
        {open ? "Close Chat" : "Ask Me"}
      </button>
      {open ? (
        <div className="chat-panel">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div className={`chat-bubble ${message.role}`} key={`${message.role}-${index}`}>
                {message.content}
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={onSubmit}>
            <input
              aria-label="chat prompt"
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="问我做过什么项目"
              value={prompt}
            />
            <button disabled={loading} type="submit">
              {loading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
