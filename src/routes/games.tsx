import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, Play, Star, TrendingUp } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Logo } from "@/components/Logo";
import { LoadingDialog } from "@/components/LoadingDialog";
import { Brand } from "@/components/Brand";
import { ChoiceDialog, CodeDialog } from "@/components/ActivationDialogs";
import {
  clearAwaitingCode,
  
  readPendingGame,
  savePendingGame,
} from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import apple from "@/assets/game-apple.jpg";
import crash from "@/assets/game-crash.jpg";
import mines from "@/assets/game-mines.jpg";
import thimbles from "@/assets/game-thimbles.jpg";
import wildwest from "@/assets/game-wildwest.jpg";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "كريزي سكربت | سكربت الطياره وسكربت التفاحه Crash Script" },
      {
        name: "description",
        content:
          "كريزي سكربت (crazy script): سكربت الطياره Aviator، سكربت التفاحه Apple of Fortune script، crash script، ماينز والأكواب — إشارات وكود تفعيل مجاني.",
      },
      {
        name: "keywords",
        content:
          "سكربت الطياره, اسكربت الطياره, سكربت التفاحه, اسكربت التفاحه, كريزي سكربت, كريزي اسكربت, crazy script, crash script, apple of fortune script, aviator script",
      },
      { property: "og:title", content: "كريزي سكربت | سكربت الطياره وسكربت التفاحه Crash Script" },
      { property: "og:description", content: "سكربت الطياره، سكربت التفاحه، crash script و apple of fortune script مع كريزي سكربت." },

      { property: "og:type", content: "website" },
      { property: "og:url", content: "/games" },
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
    links: [{ rel: "canonical", href: "/games" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "CRAZY SCRIPT",
          alternateName: [
            "كريزي سكربت",
            "كريزي اسكربت",
            "سكربت الطياره",
            "اسكربت الطياره",
            "سكربت التفاحه",
            "اسكربت التفاحه",
            "crazy script",
            "crash script",
            "apple of fortune script",
            "aviator script",
          ],
          url: "/games",
          inLanguage: "ar",
          description:
            "سكربت الطياره وسكربت التفاحه وإشارات ألعاب 1xBet وLineBet مع كود تفعيل من كريزي سكربت.",
        }),
      },
    ],
  }),
  component: GamesPage,
});


const GAMES = [
  { name: "Apple of fortune", img: apple, tag: "HOT", rate: "94%", to: "/game/apple" },
  { name: "Crash", img: crash, tag: "TOP", rate: "97%", to: "/game/aviator" },
  { name: "Gems Mines", img: mines, tag: "NEW", rate: "92%", to: "/game/mines" },
  { name: "Thimbles", img: thimbles, tag: "VIP", rate: "90%", to: "/game/thimbles" },
  { name: "Wild West", img: wildwest, tag: "HOT", rate: "95%", to: "/game/wildwest" },

];

function GamesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({});

  // Coming back from the Telegram bot: just land on this first page,
  // no code input is opened automatically.
  useEffect(() => {
    clearAwaitingCode();
  }, []);

  // Win rates are controlled from the admin panel.
  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from("game_rates").select("name, rate");
      const map: Record<string, number> = {};
      (data ?? []).forEach((r: { name: string; rate: number }) => (map[r.name] = r.rate));
      setRates(map);
    })();
  }, []);

  const rateOf = (g: { name: string; rate: string }) =>
    rates[g.name] !== undefined ? `${rates[g.name]}%` : g.rate;

  const avgRate = (() => {
    const vals = GAMES.map((g) => rates[g.name]).filter((v): v is number => typeof v === "number");
    if (!vals.length) return "94%";
    return `${Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)}%`;
  })();



  const play = (to: string) => {
    savePendingGame(to);
    setChoice(to);
  };

  const onGet = () => {
    setChoice(null);
    setLoading(true);
    setTimeout(() => navigate({ to: "/terms" }), 3000);
  };

  const onUse = () => {
    setCodeOpen(true);
  };

  const onVerified = () => {
    const to = (choice ?? readPendingGame() ?? "") || "/game/apple";
    clearAwaitingCode();
    setCodeOpen(false);
    setChoice(null);
    setLoading(true);
    setTimeout(() => navigate({ to }), 3000);
  };

  return (
    <main dir="ltr" className="relative z-10 min-h-screen bg-transparent pb-16">
      <TopBar />

      <div className="mx-auto max-w-md px-4 pt-8">
        <Logo size={120} />

        <div
          className="mx-auto mt-5 flex items-center justify-center overflow-hidden rounded-2xl border border-primary/40 bg-black/40 shadow-[0_0_35px_rgba(242,184,56,0.18)]"
          style={{ width: 380, maxWidth: "100%", height: 200 }}
        >
          <video
            src="https://www.image2url.com/r2/default/videos/1787270560353-b5f64dc7-8096-44ba-9e0e-9562eaf7738c.mov"
            autoPlay
            loop
            muted
            ref={(el) => {
              if (!el) return;
              el.muted = true;
              el.play().catch(() => {});
            }}
            playsInline
            controls
            preload="auto"
            className="h-full w-full object-cover"
          />

        </div>


        <h1 className="mt-4 text-center text-2xl">
          <Brand />
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Premium signals · أعلى نسبة فوز اليوم
        </p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          كريزي سكربت (crazy script) — سكربت الطياره Aviator وسكربت التفاحه Apple of Fortune وماينز والأكواب
        </p>


        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: Flame, label: "Hot", value: "5" },
            { icon: TrendingUp, label: "Winrate", value: avgRate },
            { icon: Star, label: "VIP", value: "PRO" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-primary/25 bg-transparent p-3 text-center backdrop-blur-sm"
            >
              <s.icon className="mx-auto h-4 w-4 text-primary" />
              <div className="mt-1 text-sm font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-10">
          {GAMES.map((g, i) => (
            <div key={g.name} className="flex flex-col items-center gap-4">
              <div className="flex w-[280px] items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
                <span className="rounded-full border border-primary/40 px-2 py-0.5 font-bold text-primary">
                  {g.tag}
                </span>
              </div>

              <div
                className="group relative overflow-hidden rounded-2xl border border-primary/40 bg-transparent shadow-[0_0_35px_rgba(242,184,56,0.18)] backdrop-blur-sm"
                style={{ width: 280, height: 180 }}
              >
                <img
                  src={g.img}
                  alt={g.name}
                  loading="lazy"
                  width={800}
                  height={512}
                  className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
                  <span className="text-lg font-extrabold text-foreground drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]">
                    {g.name}
                  </span>
                  <span className="rounded-md border border-primary/50 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    RTP {rateOf(g)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => play(g.to)}
                style={{ width: 280 }}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-white/95 py-3 text-base font-bold text-black transition-transform active:scale-95"
              >
                <Play className="h-4 w-4" />
                اللعب الآن
              </button>
            </div>
          ))}
        </div>

        <section dir="rtl" className="sr-only space-y-4 text-right">
          <h2 className="text-lg font-black text-foreground">
            سكربت الطياره وسكربت التفاحه من كريزي سكربت
          </h2>
          <p className="text-xs leading-6 text-muted-foreground">
            كريزي سكربت (crazy script) منصة إشارات لألعاب المنصات: <strong>سكربت الطياره</strong>{" "}
            (aviator / crash script) يوضح نقطة الخروج المتوقعة قبل الجولة، و
            <strong> سكربت التفاحه</strong> (apple of fortune script) يوضح التفاحة السليمة في كل صف
            مع نسب المضاعفة. كل ما تحتاجه هو كود التفعيل من البوت بعد استكمال الشروط.
          </p>

          <h3 className="text-base font-bold text-foreground">اسكربت الطياره (Crash Script)</h3>
          <p className="text-xs leading-6 text-muted-foreground">
            افتح صفحة الطياره واضغط بدأ ليعرض لك اسكربت الطياره نسبة المضاعفة المتوقعة للجولة الحالية
            لحظة بلحظة.
          </p>

          <h3 className="text-base font-bold text-foreground">
            اسكربت التفاحه (Apple of Fortune Script)
          </h3>
          <p className="text-xs leading-6 text-muted-foreground">
            في اسكربت التفاحه تظهر لك خلايا كل صف من 1.23 حتى 349.43 مع تحديد التفاحة السليمة، ويمكنك
            إعادة البدء للحصول على توزيع جديد.
          </p>
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          كل الحقوق محفوظة لدى منصة crazy script
        </p>
      </div>


      <ChoiceDialog
        open={choice !== null && !codeOpen}
        onClose={() => setChoice(null)}
        onUse={onUse}
        onGet={onGet}
      />
      <CodeDialog
        open={codeOpen}
        onClose={() => {
          setCodeOpen(false);
          clearAwaitingCode();
        }}
        onVerified={onVerified}
        onAdmin={() => {
          setCodeOpen(false);
          clearAwaitingCode();
          setChoice(null);
          navigate({ to: "/admin" });
        }}
      />

      <LoadingDialog open={loading} />
    </main>
  );
}
