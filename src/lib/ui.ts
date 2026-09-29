// Etichette dell'interfaccia (non sono contenuti editoriali). Ogni testo esiste in entrambe le lingue.
import type { Lang, PageKey } from "./routes.ts";

export type UiStrings = {
  siteName: string;
  skip: string;
  menu: string;
  closeMenu: string;
  mainNav: string;
  footerNav: string;
  languageNav: string;
  languageNames: Record<Lang, string>;
  nav: Record<PageKey, string>;
  sectionsNav: string;
  sections: { hero: string; firm: string; expertise: string; people: string; closing: string };
  personPlaceholder: string;
  roleTbd: string;
  photoSoon: string;
  imagePlaceholder: string;
  bioTbd: string;
  backToPeople: string;
  toFirm: string;
  expertiseLabel: string;
  languagesLabel: string;
  notFoundTitle: string;
  notFoundText: string;
  backHome: string;
  emailLabel: string;
  phoneLabel: string;
  officesLabel: string;
};

export const UI: Record<Lang, UiStrings> = {
  it: {
    siteName: "Studio Avvocati Zappalà",
    skip: "Vai al contenuto",
    menu: "Menu",
    closeMenu: "Chiudi",
    mainNav: "Navigazione principale",
    footerNav: "Navigazione a piè di pagina",
    languageNav: "Lingua",
    languageNames: { it: "Italiano", en: "English" },
    nav: {
      home: "Home",
      firm: "Lo studio",
      expertise: "Competenze",
      people: "Persone",
      contact: "Contatti",
      privacy: "Informativa sulla privacy",
    },
    sectionsNav: "Sezioni della pagina",
    sections: { hero: "Apertura", firm: "Lo studio", expertise: "Competenze", people: "Persone", closing: "Contatti" },
    personPlaceholder: "Profilo segnaposto",
    roleTbd: "Ruolo da definire",
    photoSoon: "Foto in arrivo",
    imagePlaceholder: "Immagine di architettura (segnaposto)",
    bioTbd: "[Biografia da fornire]",
    backToPeople: "Tutte le persone",
    toFirm: "Lo studio",
    expertiseLabel: "Competenze",
    languagesLabel: "Lingue",
    notFoundTitle: "Pagina non trovata",
    notFoundText: "La pagina che cerchi non esiste o è stata spostata.",
    backHome: "Torna alla home",
    emailLabel: "E-mail",
    phoneLabel: "Telefono",
    officesLabel: "Sedi",
  },
  en: {
    siteName: "Studio Avvocati Zappalà",
    skip: "Skip to content",
    menu: "Menu",
    closeMenu: "Close",
    mainNav: "Main navigation",
    footerNav: "Footer navigation",
    languageNav: "Language",
    languageNames: { it: "Italiano", en: "English" },
    nav: {
      home: "Home",
      firm: "The firm",
      expertise: "Expertise",
      people: "People",
      contact: "Contact",
      privacy: "Privacy notice",
    },
    sectionsNav: "Page sections",
    sections: { hero: "Introduction", firm: "The firm", expertise: "Expertise", people: "People", closing: "Contact" },
    personPlaceholder: "Placeholder profile",
    roleTbd: "Role to be defined",
    photoSoon: "Photo coming soon",
    imagePlaceholder: "Architecture image (placeholder)",
    bioTbd: "[Biography to be provided]",
    backToPeople: "All people",
    toFirm: "The firm",
    expertiseLabel: "Expertise",
    languagesLabel: "Languages",
    notFoundTitle: "Page not found",
    notFoundText: "The page you are looking for does not exist or has been moved.",
    backHome: "Back to home",
    emailLabel: "Email",
    phoneLabel: "Phone",
    officesLabel: "Offices",
  },
};
