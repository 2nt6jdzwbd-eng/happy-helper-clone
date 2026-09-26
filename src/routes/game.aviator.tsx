import { createFileRoute } from "@tanstack/react-router";
import { useRequireSession } from "@/lib/guard";
import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Logo } from "@/components/Logo";
import { GameHeaderStats } from "@/components/GameHeaderStats";
import { WinFeed } from "@/components/WinFeed";
import { fetchAviatorOdd, isFirebaseMode } from "@/lib/firebase-signals";

export const Route = createFileRoute("/game/aviator")({
  head: () => ({
    meta: [
      { title: "سكربت الطياره Aviator Crash Script | كريزي سكربت" },
      {
        name: "description",
        content:
          "سكربت الطياره (aviator / crash script) من كريزي سكربت: إشارات نقطة الخروج ونسبة المضاعفة المتوقعة لكل جولة.",
      },
      { property: "og:title", content: "سكربت الطياره Aviator Crash Script | كريزي سكربت" },
      { property: "og:description", content: "اعرف نقطة الخروج المتوقعة قبل الجولة مع سكربت الطياره." },
      { name: "keywords", content: "سكربت الطياره, اسكربت الطياره, crash script, aviator script, كريزي سكربت, crazy script" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/game/aviator" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:image",
        content: "https://project--45915fe9-9986-4de9-aa3c-9c293e09ef07.lovable.app/logo.png",
      },
      {
        name: "twitter:image",
        content: "https://project--45915fe9-9986-4de9-aa3c-9c293e09ef07.lovable.app/logo.png",
      },
    ],
    links: [{ rel: "canonical", href: "/game/aviator" }],
  }),

  component: AviatorGame,
});

const W = 320;
const H = 180;
const DUR = 1500;

function pointAt(t: number) {
  // curved path from bottom-left to top-right
  const x = 10 + (W - 20) * t;
  const y = H - 12 - (H - 40) * Math.pow(t, 2.2);
  return { x, y };
}

function AviatorGame() {
  useRequireSession();
  const [odd, setOdd] = useState(1);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  useEffect(() => {
    if (!isFirebaseMode()) setBusy(true);
  }, []);

  const start = async () => {
    if (!isFirebaseMode()) {
      setBusy(true);
      return;
    }
    if (raf.current) cancelAnimationFrame(raf.current);
    const remote = await fetchAviatorOdd();
    if (!remote) return;
    const target = remote;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / DUR);
      setProgress(t);
      setOdd(1 + (target - 1) * t);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };


  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setProgress(0);
    setOdd(1);
  };

  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * progress;
    const p = pointAt(t);
    pts.push(`${p.x},${p.y}`);
  }
  const head = pointAt(progress);

  return (
    <main dir="ltr" className="relative z-10 min-h-screen bg-transparent pb-16">
      <TopBar />
      <GameHeaderStats />

      <div className="mx-auto max-w-md px-4 pt-4">
        <Logo size={84} />

        <div className="relative mt-5 overflow-hidden rounded-2xl border border-primary/40 bg-black/30 backdrop-blur-sm">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="aviator curve">
            <defs>
              <linearGradient id="av-line" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            {progress > 0 && (
              <>
                <polyline
                  points={pts.join(" ")}
                  fill="none"
                  stroke="url(#av-line)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx={head.x} cy={head.y} r="10" fill="var(--primary)" opacity="0.25" />
                <circle cx={head.x} cy={head.y} r="6" fill="var(--primary)" />
              </>
            )}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black tracking-tight drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <span className="text-primary">x</span>
              <span className="text-foreground">{odd.toFixed(2)}</span>
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={start}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-black text-black transition active:scale-95"
            style={{ backgroundColor: "var(--primary)", boxShadow: "0 0 26px color-mix(in oklab, var(--primary) 50%, transparent)" }}
          >
            <Play className="h-4 w-4" /> بدأ
          </button>
          <button
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/70 bg-white/95 py-3 text-sm font-black text-black transition active:scale-95"
          >
            <RotateCcw className="h-4 w-4" /> اعاده بدأ
          </button>
        </div>

        <WinFeed />

        <p className="mt-10 text-center text-xs text-muted-foreground">
          كل الحقوق محفوظة لدى منصة crazy script
        </p>
      </div>

      {busy && (
        <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="w-full max-w-sm rounded-2xl border border-primary/40 bg-background p-6 text-center">
            <p className="text-base font-black text-foreground">يرجي تجربه لعبه اخري الان</p>
            <p className="mt-2 text-sm text-muted-foreground">
              لوجود ضغط علي سيرفر اللعبه حاليا
            </p>
            <button
              onClick={() => setBusy(false)}
              className="mt-5 w-full rounded-xl py-3 text-sm font-black text-black transition active:scale-95"
              style={{ backgroundColor: "var(--primary)" }}
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </main>

  );
}
