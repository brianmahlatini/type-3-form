import { useMemo, useRef, useState } from "react";
import { bytesToHuman } from "../lib/format";
import { cn } from "../lib/cn";

const MAX_BYTES = 10 * 1024 * 1024;

export function FileUpload({
  name,
  onFileSelected,
  error,
}: {
  name: string;
  onFileSelected: (file: File | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const helper = useMemo(() => {
    if (!file) return `Upload 1 supported file. Max ${bytesToHuman(MAX_BYTES)}.`;
    return `${file.name} • ${bytesToHuman(file.size)}`;
  }, [file]);

  function selectFile(next: File | null) {
    setFile(next);
    onFileSelected(next);
  }

  return (
    <div>
      <input
        ref={inputRef}
        name={name}
        type="file"
        className="sr-only"
        onChange={(e) => {
          const f = e.currentTarget.files?.[0] ?? null;
          if (f && f.size > MAX_BYTES) {
            selectFile(null);
            e.currentTarget.value = "";
            return;
          }
          selectFile(f);
        }}
      />

      <div
        className={cn(
          "group relative flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-slate-950/30 px-4 py-5 text-center transition",
          isDragging ? "border-cyan-300/60 bg-white/10" : "hover:bg-white/5",
          error ? "border-rose-400/50" : null,
        )}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const dropped = e.dataTransfer.files?.[0] ?? null;
          if (!dropped) return;
          if (dropped.size > MAX_BYTES) {
            selectFile(null);
            return;
          }
          selectFile(dropped);
        }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="text-white/70">
            <path
              fill="currentColor"
              d="M19 9a7 7 0 0 0-13.93 1.04A4.5 4.5 0 0 0 5.5 19H19a4 4 0 0 0 0-8Zm-7 1v6h-2v-6H7l5-5 5 5h-3Z"
            />
          </svg>
          Drag & drop or click to upload
        </div>
        <div className="text-xs text-white/55">{helper}</div>
        {file ? (
          <div className="mt-1 text-xs text-white/70 underline underline-offset-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hover:text-white"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = "";
                selectFile(null);
              }}
            >
              Remove file
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

