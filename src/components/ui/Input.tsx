import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/15",
        className,
      )}
      {...props}
    />
  );
}

