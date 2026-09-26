import { useEffect, useState } from "react";

export function LoadingDialog({ open, duration = 3000 }: { open: boolean; duration?: number }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!open) {
      setPct(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => {
      setPct(Math.min(100, ((Date.now() - start) / duration) * 100));
    }, 40);
    return () => clearInterval(id);
  }, [open, duration]);

  if (!open) return null;

  const r = 26;
  const c = 2 * Math.PI * r;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* outer pulse halo */}
        <span
           className="absolute h-[110px] w-[110px] animate-ping rounded-md bg-primary/10"
        />
        {/* rotating dashed ring */}
        <svg
          className="absolute h-[100px] w-[100px] animate-spin [animation-duration:3.5s]"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--primary)"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeDasharray="4 10"
            strokeLinecap="round"
          />
        </svg>

        <div
           className="relative flex items-center justify-center rounded-md border-2 border-primary bg-card shadow-xl"
          style={{
            width: 80,
            height: 80,
          }}
        >
          {/* corner ticks */}
          <span className="absolute left-1 top-1 h-2.5 w-2.5 rounded-tl border-l-2 border-t-2" style={{ borderColor: "var(--primary)" }} />
          <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-br border-b-2 border-r-2" style={{ borderColor: "var(--primary)" }} />

          <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r={r} fill="none" stroke="var(--primary)" strokeOpacity="0.18" strokeWidth="4" />
            <circle
              cx="32"
              cy="32"
              r={r}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - (pct / 100) * c}
            />
          </svg>

          <span
            className="absolute text-[13px] font-black tabular-nums"
            style={{ color: "var(--primary)" }}
          >
            {Math.round(pct)}%
          </span>
        </div>
      </div>
    </div>
  );
}
