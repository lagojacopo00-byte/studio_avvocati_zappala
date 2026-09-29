import Image from "next/image";
import { getApprovedImage } from "@/lib/content";
import type { Lang } from "@/lib/routes";
import { UI } from "@/lib/ui";

type Props = { imageId: string; lang: Lang; priority?: boolean; sizes?: string };

/**
 * Immagine di architettura dal registro (solo se "approvata"); altrimenti un segnaposto esplicito.
 * Il segnaposto porta data-placeholder: la verifica di produzione fallisce se ne resta uno.
 */
export function ArchImage({ imageId, lang, priority = false, sizes = "(min-width: 900px) 30vw, 100vw" }: Props) {
  const record = getApprovedImage(imageId);
  if (!record) {
    return (
      <div className="media-ph" data-placeholder="true" aria-hidden="true">
        <span>{UI[lang].imagePlaceholder}</span>
      </div>
    );
  }
  return (
    <Image
      src={`/images/${record.file}`}
      alt={record.alt[lang]}
      fill
      priority={priority}
      sizes={sizes}
      style={{ objectFit: "cover", objectPosition: `${record.focal[0] * 100}% ${record.focal[1] * 100}%` }}
    />
  );
}
