"use client";

import { useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

function getOrCreateVisitorId() {
  const existing = window.localStorage.getItem("visitor_id");
  if (existing) {
    return existing;
  }

  const created = crypto.randomUUID();
  window.localStorage.setItem("visitor_id", created);
  return created;
}

function getOrCreateSessionId() {
  const key = "session_id";
  const existing = window.sessionStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const created = crypto.randomUUID();
  window.sessionStorage.setItem(key, created);
  return created;
}

export function VisitTracker() {
  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const path = window.location.pathname;

    fetch(`${API_BASE_URL}/track/page-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitor_id: visitorId,
        session_id: sessionId,
        path,
        title: document.title,
        referrer: document.referrer || null,
      }),
    }).catch(() => undefined);
  }, []);

  return null;
}
