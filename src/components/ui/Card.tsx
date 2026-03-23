import type { PropsWithChildren } from "react";
import { cn } from "../../lib/cn";

export function Card({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("rounded-2xl border border-white/15 bg-white/5 shadow-soft", className)}>{children}</div>
  );
}

export function CardHeader({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("border-b border-white/10 px-6 py-6", className)}>{children}</div>;
}

export function CardContent({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("px-6 py-6", className)}>{children}</div>;
}

