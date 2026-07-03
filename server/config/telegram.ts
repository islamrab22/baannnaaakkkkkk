import { env } from "./env.ts";
import { logger } from "./logger.ts";

const configured = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);

export const telegramConfigured = configured;

/**
 * Fire-and-forget notification to a Telegram chat. Never throws — a
 * missing/invalid bot config or a Telegram API hiccup must never break
 * the request that triggered the notification.
 */
export async function sendTelegramNotification(text: string): Promise<void> {
  if (!configured) return;

  try {
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.warn("Telegram notification rejected", { status: res.status, body });
    }
  } catch (err) {
    logger.warn("Failed to send Telegram notification", err instanceof Error ? err.message : err);
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatTelegramMessage(title: string, fields: Record<string, string | number | null | undefined>): string {
  const lines = [`<b>${escapeHtml(title)}</b>`];
  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined || value === "") continue;
    lines.push(`<b>${escapeHtml(key)}:</b> ${escapeHtml(String(value))}`);
  }
  return lines.join("\n");
}
