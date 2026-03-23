export function bytesToHuman(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  const rounded = value >= 10 || index === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[index]}`;
}

