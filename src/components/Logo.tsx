import logo from "@/assets/logo.png";

export function Logo({ size = 120, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logo}
      alt="CRAZY SCRIPT logo"
      width={size}
      height={size}
      className={`mx-auto drop-shadow-[0_0_25px_rgba(242,184,56,0.45)] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
