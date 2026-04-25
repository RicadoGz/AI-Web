import { useEffect, useRef } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Globe,
  Instagram,
  Sparkles,
  Twitter,
} from "lucide-react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

const FADE_DURATION_MS = 500;
const LOOP_RESET_DELAY_MS = 100;
const FADE_OUT_REMAINING_SECONDS = 0.55;

const projects = [
  {
    name: "Orbit Flow",
    summary: "An AI workflow concept for turning messy research into actions a team can actually run with.",
    meta: "AI Workflow",
    href: "#",
  },
  {
    name: "Signal Brief",
    summary: "A product idea for translating fast-moving AI news into clean briefs and useful next steps.",
    meta: "Product Prototype",
    href: "#",
  },
  {
    name: "Loop Agent",
    summary: "An agentic experiment focused on lightweight automation instead of overbuilt AI theater.",
    meta: "Agent Tool",
    href: "#",
  },
  {
    name: "Muse Lab",
    summary: "A creative AI playground for testing how new model capabilities can become better user experiences.",
    meta: "AI Experiment",
    href: "#",
  },
];

const explorationAreas = [
  "AI-native product ideas that feel useful instead of forced.",
  "Rapid prototypes that turn new model capabilities into real interactions.",
  "Lean agent workflows that help teams move earlier and think clearer.",
];

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const opacityRef = useRef(0);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const setOpacity = (value: number) => {
      opacityRef.current = value;
      video.style.opacity = value.toString();
    };

    const cancelFade = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const fadeTo = (targetOpacity: number) => {
      cancelFade();

      const startOpacity = opacityRef.current;
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / FADE_DURATION_MS, 1);
        const nextOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        setOpacity(nextOpacity);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        animationFrameRef.current = null;
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    const playFromStart = () => {
      if (restartTimeoutRef.current !== null) {
        window.clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }

      fadingOutRef.current = false;
      video.currentTime = 0;
      Promise.resolve(video.play()).catch(() => undefined);
      fadeTo(1);
    };

    const handleLoadedData = () => {
      setOpacity(0);
      Promise.resolve(video.play()).catch(() => undefined);
      fadeTo(1);
    };

    const handleTimeUpdate = () => {
      if (!video.duration || fadingOutRef.current) {
        return;
      }

      if (video.duration - video.currentTime <= FADE_OUT_REMAINING_SECONDS) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const handleEnded = () => {
      cancelFade();
      setOpacity(0);

      restartTimeoutRef.current = window.setTimeout(() => {
        playFromStart();
      }, LOOP_RESET_DELAY_MS);
    };

    setOpacity(0);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      cancelFade();

      if (restartTimeoutRef.current !== null) {
        window.clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className="overflow-x-hidden bg-[#050608] text-[#f4efe6]">
      <section className="relative min-h-[100dvh] overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full translate-y-[17%] object-cover"
          src={VIDEO_URL}
          style={{ opacity: 0 }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(93,135,255,0.22),transparent_35%),linear-gradient(180deg,rgba(2,6,15,0.18)_0%,rgba(3,5,10,0.76)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col px-6 pb-10 pt-8">
          <div className="flex items-center justify-between">
            <div className="liquid-glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/72">
              <span className="h-2 w-2 rounded-full bg-[#9bb9ff]" />
              Ricardo
            </div>
            <div className="hidden text-[11px] uppercase tracking-[0.24em] text-white/45 md:block">
              Exploring AI, Building Products
            </div>
          </div>

          <div className="flex flex-1 items-end pb-16 pt-14 md:pb-20">
            <div className="max-w-5xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/64 backdrop-blur-sm">
                <Sparkles size={14} />
                Student builder with a product brain
              </div>
              <p className="mb-5 text-sm text-[#d7d0c4]/72 md:text-base">
                Ricardo — Exploring AI, Building Products
              </p>
              <h1
                className="max-w-5xl text-[clamp(3rem,7.4vw,7.4rem)] leading-[0.92] tracking-[-0.05em] text-[#f7f2e8]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                I explore new AI ideas and turn them into products worth trying.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#ece4d5]/74 md:text-lg">
                Still early, still learning, still building with AI every chance I get.
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6">
            <a
              className="inline-flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
              href="#projects"
            >
              <span className="liquid-glass inline-flex h-12 w-12 items-center justify-center rounded-full">
                <ArrowDown size={18} />
              </span>
              Scroll for selected work
            </a>
            <p className="hidden max-w-sm text-right text-sm leading-relaxed text-white/44 md:block">
              Building with new AI tools, testing product instincts, and learning in public
              through fast experiments.
            </p>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/8 bg-[#07080c] px-6 py-24 md:py-32" id="projects">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#98a3b8]">
                Selected projects
              </p>
              <h2
                className="text-[clamp(2.4rem,4vw,4.5rem)] leading-[0.95] tracking-[-0.04em] text-[#f7f2e8]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Four ideas, four ways of exploring what AI products can become.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/50">
              Not a list of frameworks. A set of experiments shaped by product taste,
              curiosity, and a bias toward building.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <a
                className="project-card group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1017] p-7 text-left transition-all duration-500 hover:-translate-y-1 hover:border-[#9bb9ff]/32 hover:bg-[#10131b]"
                href={project.href}
                key={project.name}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,161,255,0.14),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)] opacity-80" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-10 flex items-start justify-between gap-4">
                    <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/48">
                      {project.meta}
                    </span>
                    <span className="text-sm text-white/28">0{index + 1}</span>
                  </div>
                  <div className="mt-auto">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h3 className="text-2xl tracking-[-0.03em] text-[#f5efe4]">
                        {project.name}
                      </h3>
                      <ArrowUpRight
                        className="translate-y-1 text-white/35 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#bfd0ff]"
                        size={20}
                      />
                    </div>
                    <p className="max-w-[34ch] text-sm leading-relaxed text-white/56">
                      {project.summary}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-[#050608] px-6 py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#98a3b8]">
              What I&apos;m exploring
            </p>
            <h2
              className="max-w-3xl text-[clamp(2rem,3.2vw,3.75rem)] leading-[0.97] tracking-[-0.04em] text-[#f7f2e8]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              I&apos;m interested in the layer between new AI capability and a product that
              actually feels worth using.
            </h2>
          </div>

          <div className="space-y-4">
            {explorationAreas.map((item) => (
              <div
                className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-5 text-sm leading-relaxed text-white/60"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 bg-[#050608] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <p className="text-xs uppercase tracking-[0.22em] text-white/34">
            Ricardo — Exploring AI, Building Products
          </p>
          <div className="flex items-center gap-3">
            <a
              aria-label="Instagram"
              className="low-key-link"
              href="https://instagram.com"
            >
              <Instagram size={16} />
            </a>
            <a aria-label="Twitter" className="low-key-link" href="https://x.com">
              <Twitter size={16} />
            </a>
            <a aria-label="Website" className="low-key-link" href="/">
              <Globe size={16} />
            </a>
          </div>
        </div>
      </footer>

      <button
        className="liquid-glass fixed bottom-5 right-5 z-30 inline-flex h-14 items-center gap-3 rounded-full px-4 text-sm text-white/80 transition-all duration-300 hover:bg-white/[0.04] hover:text-white"
        type="button"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06]">
          <Bot size={16} />
        </span>
        AI Chat
      </button>
    </main>
  );
}
