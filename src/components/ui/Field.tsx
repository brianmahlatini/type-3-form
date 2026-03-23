import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Field({
  label,
  required,
  hint,
  error,
  className,
  children,
}: PropsWithChildren<{
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
}>) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/5 p-4", className)}>
      <div className="mb-2 flex items-center gap-2">
        <div className="text-xs font-medium tracking-wide text-white/80">{label}</div>
        {required ? <span className="text-xs font-semibold text-rose-400">*</span> : null}
      </div>
      {children}
      {error ? <div className="mt-2 text-xs text-rose-300">{error}</div> : null}
      {hint ? <div className="mt-2 text-xs text-white/55">{hint}</div> : null}
    </div>
  );
}

