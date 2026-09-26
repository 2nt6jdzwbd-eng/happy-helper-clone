export function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-wide ${className}`}>
      <span className="text-primary drop-shadow-[0_0_10px_rgba(242,184,56,0.6)]">CRAZY</span>{" "}
      <span className="text-foreground">SCRIPT</span>
    </span>
  );
}
