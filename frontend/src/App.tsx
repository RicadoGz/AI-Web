import { FormEvent, useEffect, useRef } from "react";
import { ArrowRight, Globe, Instagram, Twitter } from "lucide-react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

const FADE_DURATION_MS = 500;
const LOOP_RESET_DELAY_MS = 100;
const FADE_OUT_REMAINING_SECONDS = 0.55;

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black">
      <div className="relative flex min-h-screen flex-col">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full translate-y-[17%] object-cover"
          src={VIDEO_URL}
          style={{ opacity: 0 }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.68)_100%)]" />

        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
            <div className="flex items-center gap-8">
              <a className="flex items-center gap-2" href="/">
                <Globe className="text-white" size={24} />
                <span className="text-lg font-semibold text-white">Asme</span>
              </a>
              <div className="hidden items-center gap-8 md:flex">
                <a
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                  href="#features"
                >
                  Features
                </a>
                <a
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                  href="#pricing"
                >
                  Pricing
                </a>
                <a
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                  href="#about"
                >
                  About
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-white" type="button">
                Sign Up
              </button>
              <button
                className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
                type="button"
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        <main className="relative z-10 flex flex-1 -translate-y-[20%] flex-col items-center justify-center px-6 py-12 text-center">
          <h1
            className="mb-8 whitespace-nowrap text-5xl tracking-tight text-white md:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Built for the curious
          </h1>

          <div className="w-full max-w-xl space-y-4">
            <form
              className="liquid-glass flex items-center gap-3 rounded-full pl-6 pr-2 py-2"
              onSubmit={handleSubmit}
            >
              <input
                aria-label="Enter your email"
                className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
                placeholder="Enter your email"
                type="email"
              />
              <button
                aria-label="Submit email"
                className="rounded-full bg-white p-3 text-black"
                type="submit"
              >
                <ArrowRight size={20} />
              </button>
            </form>

            <p className="px-4 text-sm leading-relaxed text-white">
              Stay updated with the latest news and insights. Subscribe to our newsletter
              today and never miss out on exciting updates.
            </p>

            <div className="flex justify-center">
              <button
                className="liquid-glass rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
                type="button"
              >
                Manifesto
              </button>
            </div>
          </div>
        </main>

        <footer className="relative z-10 flex justify-center gap-4 pb-12">
          <a
            aria-label="Instagram"
            className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
            href="https://instagram.com"
          >
            <Instagram size={20} />
          </a>
          <a
            aria-label="Twitter"
            className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
            href="https://x.com"
          >
            <Twitter size={20} />
          </a>
          <a
            aria-label="Website"
            className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
            href="/"
          >
            <Globe size={20} />
          </a>
        </footer>
      </div>
    </div>
  );
}
