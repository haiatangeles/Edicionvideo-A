import { Caption } from "@remotion/captions";
import { Guion } from "./guion";
import subtitulos from "./subtitulos-ep2.json";

// Episodio 02: el presupuesto real (tiempos sacados de la transcripción con Whisper)
export const episodio2: Guion = {
  video: "episodio-2.mp4",
  duracionSeg: 107.4,

  gancho: {
    hasta: 3,
    antes: "planeando mi",
    titulo: "BODA EN PARÍS",
    pastilla: "con presupuesto real",
  },

  intro: {
    desde: 3,
    hasta: 6,
    manuscrita: "bienvenida a",
    titulo: "EPISODIO 02",
    pastilla: "de mi boda en París",
  },

  titulos: [
    {
      desde: 12.8,
      hasta: 18.4,
      texto: "hablemos del presupuesto",
      sticker: "corazon",
    },
    {
      desde: 18.5,
      hasta: 24.2,
      texto: "qué gastar y qué no",
      sticker: "tacones",
    },
    {
      desde: 41,
      hasta: 47.5,
      texto: "ten un presupuesto real",
      sticker: "anillos",
    },
    {
      desde: 49.3,
      hasta: 56.5,
      texto: "TikTok, Pinterest…\n¡lo quiero!",
      sticker: "vestido",
    },
    {
      desde: 57.5,
      hasta: 62.8,
      texto: "o salen más gastos",
      sticker: "pastel",
    },
    {
      desde: 63.5,
      hasta: 68.6,
      texto: "habla con tu esposo",
      sticker: "traje",
    },
    {
      desde: 68.7,
      hasta: 74,
      texto: "«lo que tú quieras,\nmi amor»",
      sticker: "corazon",
    },
    {
      desde: 74.2,
      hasta: 80.5,
      texto: "gastar con consciencia",
      sticker: "rosas",
    },
    {
      desde: 90.5,
      hasta: 93.7,
      texto: "¡y también es válido!",
      sticker: "copas",
    },
  ],

  // "...un presupuesto de 5 mil dólares": el número sube hasta 5,000
  contador: {
    desde: 24.3,
    hasta: 28.1,
    antes: "mi presupuesto",
    cantidad: 5000,
    en: 25.5,
    despues: "dólares",
  },

  lista: {
    desde: 28.2,
    hasta: 38.6,
    titulo: "Mis prioridades:",
    puntos: [
      { texto: "Flores naturales", en: 29.2 },
      { texto: "El lugar", en: 31.5 },
      { texto: "La comida", en: 34.5 },
      { texto: "Recuerditos", en: 36.1 },
    ],
  },

  // "...siempre he preferido viajar": solo mientras lo dice
  viajes: {
    desde: 87.3,
    hasta: 90.4,
    antes: "siempre he preferido",
    titulo: "viajar",
  },

  cierre: {
    desde: 93.9,
    titulo: "sígueme para el",
    destacado: "EPISODIO 03",
    boton: "Seguir",
    botonPulsado: "Siguiendo ✓",
  },

  subtitulos: subtitulos as Caption[],
};
