from collections import Counter
from datetime import datetime, UTC

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Personal Website Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

page_views: list[dict] = []
events: list[dict] = []
chat_messages: list[dict] = []


class PageViewPayload(BaseModel):
    visitor_id: str
    session_id: str
    path: str
    title: str
    referrer: str | None = None


class EventPayload(BaseModel):
    visitor_id: str
    session_id: str
    event_name: str
    page_path: str
    metadata: dict | None = None


class ChatPayload(BaseModel):
    visitor_id: str
    session_id: str
    source_page: str
    message: str


@app.get("/health")
def health_check():
    return {"ok": True}


@app.post("/track/page-view")
def track_page_view(payload: PageViewPayload):
    page_views.append(
        {
            **payload.model_dump(),
            "created_at": datetime.now(UTC).isoformat(),
        }
    )
    return {"status": "recorded"}


@app.post("/track/event")
def track_event(payload: EventPayload):
    events.append(
        {
            **payload.model_dump(),
            "created_at": datetime.now(UTC).isoformat(),
        }
    )
    return {"status": "recorded"}


def answer_for(message: str) -> str:
    lowered = message.lower()

    if "project" in lowered or "项目" in lowered:
        return "这里适合回答你的代表项目、技术栈和实际成果。"
    if "contact" in lowered or "联系" in lowered:
        return "这里适合放邮箱、微信或 LinkedIn，让访问者知道怎么联系你。"
    if "who" in lowered or "你是谁" in lowered or "about" in lowered:
        return "这里适合放一段简短介绍，说明你是谁、在做什么、擅长什么。"
    return "这是聊天机器人的最小后端骨架，下一步可以把你的真实资料接进来。"


@app.post("/chat/message")
def chat_message(payload: ChatPayload):
    created_at = datetime.now(UTC).isoformat()
    answer = answer_for(payload.message)

    chat_messages.append(
        {
            **payload.model_dump(),
            "role": "user",
            "content": payload.message,
            "created_at": created_at,
        }
    )
    chat_messages.append(
        {
            "visitor_id": payload.visitor_id,
            "session_id": payload.session_id,
            "source_page": payload.source_page,
            "role": "assistant",
            "content": answer,
            "created_at": created_at,
        }
    )

    return {"answer": answer}


@app.get("/admin/analytics/overview")
def analytics_overview():
    unique_visitors = {view["visitor_id"] for view in page_views}
    popular_pages = Counter(view["path"] for view in page_views).most_common(5)
    event_counts = Counter(event["event_name"] for event in events)

    return {
        "page_views": len(page_views),
        "unique_visitors": len(unique_visitors),
        "chat_messages": len([item for item in chat_messages if item["role"] == "user"]),
        "popular_pages": [
            {"path": path, "count": count}
            for path, count in popular_pages
        ],
        "event_counts": dict(event_counts),
    }
