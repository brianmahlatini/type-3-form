import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-br from-brand to-brand2 text-slate-950 shadow-soft"
      : variant === "secondary"
        ? "bg-white/10 text-white hover:bg-white/15 border border-white/15"
        : "text-white/80 hover:text-white hover:bg-white/10";

  return <button className={cn(base, styles, className)} {...props} />;
}
