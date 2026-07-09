import { z } from "zod";

export const generalSchema = z.object({
  groomName: z.string(),
  brideName: z.string(),
  nameOrder: z.tuple([z.enum(["bride", "groom"]), z.enum(["bride", "groom"])]),
  weddingDate: z.string(),
  rsvpDeadline: z.string(),
  hashtag: z.string(),
  venueShortName: z.string(),
});
export type GeneralContent = z.infer<typeof generalSchema>;

export const generalDefault: GeneralContent = {
  groomName: "Stéphane",
  brideName: "Josiane",
  nameOrder: ["bride", "groom"],
  weddingDate: "2026-11-07T10:00:00",
  rsvpDeadline: "2026-10-10",
  hashtag: "#JosianeEtStéphane",
  venueShortName: "Orsay, Île-de-France",
};

const venueSchema = z.object({
  name: z.string(),
  address: z.string(),
  // optionnel : les horaires ne sont pas toujours connus à l'avance (cf. réception ci-dessous)
  timeText: z.string().optional(),
  mapsUrl: z.string(),
  phone: z.string(),
  image: z.string(),
});
export type Venue = z.infer<typeof venueSchema>;

export const venuesSchema = z.object({
  ceremony: venueSchema,
  reception: venueSchema,
});
export type VenuesContent = z.infer<typeof venuesSchema>;

export const venuesDefault: VenuesContent = {
  ceremony: {
    name: "Mairie d'Orsay",
    address: "2 Rue de la Division Leclerc, 91400 Orsay",
    timeText: "Accueil dès 10h00",
    mapsUrl: "https://maps.app.goo.gl/kmw34DX4zkXmRB5h7",
    phone: "+2250000000000",
    image: "/mairie_orsay.webp",
  },
  reception: {
    name: "Etoile 91, Palais Groupe",
    address: "2 Rue Jules Guesde, 91130 Ris-Orangis",
    // horaire pas encore arrêté
    mapsUrl: "https://maps.app.goo.gl/uHbBxemjFjTj37A39",
    phone: "+2250000000000",
    image: "/lieu_reception.png",
  },
};

const faqItemSchema = z.object({ q: z.string(), a: z.string() });

export const eventFaqSchema = z.object({ items: z.array(faqItemSchema) });
export type EventFaqContent = z.infer<typeof eventFaqSchema>;

export const eventFaqDefault: EventFaqContent = {
  items: [
    { q: "Peut-on venir avec des enfants ?", a: "Les enfants sont les bienvenus à la cérémonie civile. Par contre pour la cérémonie religieuse et la réception, il faut se référer à l'invitation reçue et au nombre de place qui vous sont attribuées sur le site internet." },
    { q: "Y a-t-il un dress code ?", a: "La tenue de soirée est recommandée. Les couleurs blanc et ivoire sont réservées aux mariés. Privilégiez des teintes élégantes — bleu nuit, rose, bordeaux ou doré seront parfaits." },
    { q: "Où se garer ?", a: "Pour la cérémonie civile, un parking gratuit est disponible sur place à la mairie d'Orsay. Pour la cérémonie religieuse, un parking privé et gratuit est disponible en face du Palais Groupe." },
    { q: "Jusqu'à quelle heure dure la soirée ?", a: "La soirée se termine officiellement à 02h00 du matin." },
    { q: "Peut-on prendre des photos pendant la cérémonie ?", a: "Nous vous demandons de ranger vos téléphones pendant la cérémonie. Notre photographe immortalisera chaque instant. Après la cérémonie, photos libres !" },
  ],
};

const galleryCardSchema = z.object({
  id: z.number(),
  img: z.string().optional(),
  tag: z.string(),
  title: z.string(),
  desc: z.string(),
  fullDesc: z.string().optional(),
  duration: z.string().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
});
export type GalleryCard = z.infer<typeof galleryCardSchema>;

export const galleryHighlightsSchema = z.object({ items: z.array(galleryCardSchema) });
export type GalleryHighlightsContent = z.infer<typeof galleryHighlightsSchema>;

export const galleryHighlightsDefault: GalleryHighlightsContent = {
  items: [
    {
      id: 1, img: "/steph1.jpg", tag: "Couple", title: "Élégance",
      desc: "Une silhouette, une présence.",
      fullDesc: "Quelques instants de complicité et d'élégance naturelle — ce regard qui dit tout sans un mot.",
      date: "2024", location: "Paris",
    },
    {
      id: 2, img: "/steph2.jpg", tag: "Voyage", title: "Vue sur la ville",
      desc: "Le monde à nos pieds.",
      fullDesc: "Surplomber une ville entière et réaliser que l'aventure ne fait que commencer. Ces voyages sont le reflet de leur soif de vie.",
      duration: "Week-end", date: "2023", location: "Nice, France",
    },
    {
      id: 3, img: "/steph4.jpg", tag: "Couple", title: "L'instant calme",
      desc: "Un café, un livre, la vie.",
      fullDesc: "C'est dans ces petits moments du quotidien — un livre, un café, la lumière du matin — que l'amour se construit vraiment.",
      date: "2022", location: "Orsay, France",
    },
    {
      id: 4, img: "/steph5.jpg", tag: "La demande", title: "Le costume bleu",
      desc: "Prêt pour le grand jour.",
      fullDesc: "Costume bleu, regard déterminé. Ce jour-là, il portait dans sa poche la question qui allait tout changer.",
      date: "2024", location: "Orsay, France",
    },
    {
      id: 5, img: "/steph8.jpg", tag: "Couple", title: "Le sourire",
      desc: "Ce sourire qui dit tout.",
      fullDesc: "Il y a des sourires qui réchauffent une pièce entière. Le sien en fait partie — et c'est ce sourire qu'elle a d'abord remarqué.",
      date: "2023", location: "Orsay, France",
    },
    {
      id: 6, tag: "Voyage", title: "Voyage de noces",
      desc: "À venir — bientôt disponible.",
      fullDesc: "Notre voyage de noces sera révélé après le grand jour. Revenez nous voir !",
      date: "Novembre 2026",
    },
  ],
};

export const SECTIONS = {
  general: { schema: generalSchema, default: generalDefault },
  venues: { schema: venuesSchema, default: venuesDefault },
  event_faq: { schema: eventFaqSchema, default: eventFaqDefault },
  gallery_highlights: { schema: galleryHighlightsSchema, default: galleryHighlightsDefault },
} as const;

export type SectionKey = keyof typeof SECTIONS;
