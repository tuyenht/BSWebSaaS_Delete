import "server-only";

type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = {
  tenantId?: string;
  siteId?: string;
  userId?: string;
  requestId?: string;
  path?: string;
  scope?: string;
  [key: string]: unknown;
};

function log(level: LogLevel, message: string, context: LogContext = {}) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  const consoleMethod = level === "error" ? "error" : level === "warn" ? "warn" : level === "debug" ? "debug" : "log";
  console[consoleMethod](JSON.stringify(payload));
}

export const logger = {
  debug: (message: string, context?: LogContext) => log("debug", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
};

