import type { MetadataRoute } from "next";
import { IS_PRODUCTION, absoluteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: absoluteUrl("/sitemap.xml") };
}
