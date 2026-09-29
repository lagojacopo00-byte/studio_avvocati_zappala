import { pageMetadata, renderPage, staticParams } from "@/views/router";

type Props = { params: Promise<{ slug?: string[] }> };

// Solo le pagine pubblicabili esistono: ogni altro indirizzo è una 404 (global-not-found).
export const dynamicParams = false;

export function generateStaticParams() {
  return staticParams("en");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata("en", slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return renderPage("en", slug);
}
