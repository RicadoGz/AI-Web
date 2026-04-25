import { ChatWidget } from "../components/chat-widget";
import { VisitTracker } from "../components/visit-tracker";

export default function HomePage() {
  return (
    <main className="page">
      <VisitTracker />
      <section className="hero">
        <p className="eyebrow">Personal Website MVP</p>
        <h1>Build trust fast with a clear story, a live chat bot, and simple visitor analytics.</h1>
        <p className="intro">
          This starter homepage is built for a personal brand site. It introduces you, gives
          visitors a way to ask questions, and records basic page and chat activity through the
          backend.
        </p>
        <div className="hero-grid">
          <article>
            <h2>What visitors see</h2>
            <p>A focused personal homepage, your project highlights, and a chat entry point.</p>
          </article>
          <article>
            <h2>What you track</h2>
            <p>Page views, chat opens, chat messages, and a lightweight analytics summary.</p>
          </article>
          <article>
            <h2>What comes next</h2>
            <p>Swap in your real bio, projects, and connect the FastAPI service to a database.</p>
          </article>
        </div>
      </section>
      <ChatWidget />
    </main>
  );
}
