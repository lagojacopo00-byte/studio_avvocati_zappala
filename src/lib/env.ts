// Ambiente di pubblicazione. "preview" è il default: noindex, segnaposto visibili.
export const SITE_ENV: "preview" | "production" = process.env.SITE_ENV === "production" ? "production" : "preview";
export const IS_PRODUCTION = SITE_ENV === "production";
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  return SITE_URL + path;
}
