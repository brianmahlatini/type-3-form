import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none transition focus:border-brand/70 focus:ring-4 focus:ring-brand/15",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
