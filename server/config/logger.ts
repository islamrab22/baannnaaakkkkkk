type LogLevel = "info" | "warn" | "error" | "debug";

function timestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, meta?: unknown) {
  const line = `[${timestamp()}] [${level.toUpperCase()}] ${message}`;
  const payload = meta !== undefined ? [line, meta] : [line];
  if (level === "error") console.error(...payload);
  else if (level === "warn") console.warn(...payload);
  else console.log(...payload);
}

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
};
