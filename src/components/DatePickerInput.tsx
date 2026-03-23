import { useRef } from "react";
import { cn } from "../lib/cn";

type Registration = {
  name: string;
  onBlur: () => void;
  onChange: (...event: any[]) => void;
  ref: (instance: HTMLInputElement | null) => void;
};

export function DatePickerInput({
  registration,
  value,
  onClear,
  className,
  disabled,
}: {
  registration: Registration;
  value?: string;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function showPicker() {
    const el = inputRef.current as any;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
  }

  return (
    <div className={cn("relative", className)}>
      <input
        type="date"
        inputMode="none"
        autoComplete="off"
        readOnly
        disabled={disabled}
        className={cn(
          "w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 pr-16 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-brand/70 focus:ring-4 focus:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-60",
        )}
        name={registration.name}
        value={value ?? ""}
        onChange={registration.onChange}
        onBlur={registration.onBlur}
        ref={(el) => {
          inputRef.current = el;
          registration.ref(el);
        }}
        onClick={() => showPicker()}
        onFocus={() => showPicker()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            showPicker();
            return;
          }

          const blocksTyping = e.key.length === 1 || e.key === "Backspace" || e.key === "Delete";
          if (blocksTyping) {
            e.preventDefault();
            showPicker();
          }
        }}
      />

      {onClear && value ? (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
          onClick={onClear}
          disabled={disabled}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}

