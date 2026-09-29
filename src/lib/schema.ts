// Schemi dei contenuti (code.md §4). Modulo senza dipendenze oltre a zod: usato anche dagli script Node.
import { z } from "zod";

export const STATUSES = ["placeholder", "bozza", "revisionato", "pubblicabile"] as const;
export const StatusSchema = z.enum(STATUSES);
export type Status = z.infer<typeof StatusSchema>;

const Text = z.string().min(1);
export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug non valido");
const Focal = z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]);

export const StudioSchema = z.object({
  status: StatusSchema,
  name: Text,
  offices: z.array(z.object({ label: Text, address: z.array(Text).min(1) })),
  email: z.email().nullable(),
  phone: z.string().nullable(),
});
export type Studio = z.infer<typeof StudioSchema>;

export const PersonMetaSchema = z.object({
  id: Text,
  slug: SlugSchema,
  fullName: Text,
  nameConfirmed: z.boolean(),
  order: z.number().int(),
  /** imageId del registro immagini; null finché non arriva la foto autorizzata */
  photo: z.object({ imageId: Text, focal: Focal }).nullable(),
  status: StatusSchema,
});
export type PersonMeta = z.infer<typeof PersonMetaSchema>;

export const PersonLangSchema = z.object({
  status: StatusSchema,
  role: z.string().nullable(),
  metaDescription: Text,
  bioShort: z.string().nullable(),
  bio: z.array(Text),
  expertise: z.array(Text),
  languages: z.array(Text),
});
export type PersonLang = z.infer<typeof PersonLangSchema>;

const PageBase = { status: StatusSchema, metaTitle: Text, metaDescription: Text };

export const PAGE_SCHEMAS = {
  home: z.object({
    ...PageBase,
    hero: z.object({ statement: Text }),
    firm: z.object({ statement: Text, linkLabel: Text }),
    expertise: z.object({
      title: Text,
      statement: Text,
      items: z.array(z.object({ title: Text, text: Text })),
      linkLabel: Text,
    }),
    people: z.object({ title: Text, intro: Text, allLabel: Text }),
    closing: z.object({ statement: Text, linkLabel: Text }),
  }),
  firm: z.object({
    ...PageBase,
    h1: Text,
    lead: Text,
    sections: z.array(z.object({ heading: Text, paragraphs: z.array(Text).min(1) })),
  }),
  expertise: z.object({
    ...PageBase,
    h1: Text,
    lead: Text,
    items: z.array(z.object({ id: SlugSchema, title: Text, summary: Text })),
  }),
  people: z.object({ ...PageBase, h1: Text, lead: Text }),
  contact: z.object({ ...PageBase, h1: Text, lead: Text, pending: Text }),
  privacy: z.object({ ...PageBase, h1: Text, paragraphs: z.array(Text).min(1) }),
} as const;

export const ImageRegisterSchema = z.array(
  z.object({
    id: SlugSchema,
    file: Text,
    subject: Text,
    author: Text,
    source: z.url(),
    license: Text,
    credit: z.string().nullable(),
    verifiedOn: Text,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    alt: z.object({ it: z.string(), en: z.string() }),
    focal: Focal,
    /** candidata = proposta in short list; approvata = autorizzata all'uso */
    status: z.enum(["candidata", "approvata"]),
  }),
);
export type ImageRecord = z.infer<typeof ImageRegisterSchema>[number];
