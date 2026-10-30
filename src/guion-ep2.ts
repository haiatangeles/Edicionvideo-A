import { Guion } from "./guion";

// Episodio 02: el presupuesto real (tiempos sacados de la transcripción con Whisper)
export const episodio2: Guion = {
  // Consejo de Instagram: abrir con el resultado final y un texto en los primeros segundos
  previo: {
    video: "episodio-2-gancho.mp4",
    duracionSeg: 4.65,
    antes: "mi boda estilo",
    titulo: "VOGUE EN PARÍS",
    banner: "sin gastar una fortuna",
  },
  video: "episodio-2.mp4",
  duracionSeg: 107.4,

  gancho: {
    hasta: 3,
    antes: "planeando mi",
    titulo: "BODA EN PARÍS",
    pastilla: "¿low cost?",
  },

  intro: {
    desde: 3,
    hasta: 5.6,
    manuscrita: "bienvenida a",
    titulo: "EPISODIO 02",
    pastilla: "de mi boda en París",
  },

  titulos: [
    {
      desde: 12.8,
      hasta: 18.4,
      texto: "Presupuesto",
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

  // Sonidos solo en lo más importante (tiempos del vídeo original)
  sonidos: [
    { en: 3, archivo: "whoosh", volumen: 0.3 }, // entra la tarjeta del episodio
    { en: 12.8, archivo: "pop", volumen: 0.35 }, // "Presupuesto"
    { en: 26.3, archivo: "ding", volumen: 0.35 }, // el contador llega a $5,000
    { en: 26.35, archivo: "brillos", volumen: 0.35 },
    { en: 29.2, archivo: "click", volumen: 0.4 }, // cada prioridad de la lista
    { en: 31.5, archivo: "click", volumen: 0.4 },
    { en: 34.5, archivo: "click", volumen: 0.4 },
    { en: 36.1, archivo: "click", volumen: 0.4 },
    { en: 52.45, archivo: "brillos", volumen: 0.35 }, // "yo lo quiero"
    { en: 71.3, archivo: "brillos", volumen: 0.25 }, // "mi amor"
    { en: 87.3, archivo: "avion", volumen: 0.35 }, // "viajar"
    { en: 96.67, archivo: "click", volumen: 0.45 }, // el dedo pulsa "Seguir"
    { en: 96.72, archivo: "ding", volumen: 0.3 },
  ],

  cierre: {
    desde: 95.6,
    titulo: "sígueme para el",
    destacado: "EPISODIO 03",
    boton: "Seguir",
    botonPulsado: "Siguiendo ✓",
  },
};

// Versión de 1 minuto: solo las partes clave
export const episodio2Corto: Guion = {
  ...episodio2,
  cortes: [
    [0, 5.65], // "Hello… planeando mi boda en París con presupuesto real"
    [12.9, 37.45], // el presupuesto: 5 mil dólares y las prioridades
    [40.45, 56.45], // "tienes que tener un presupuesto real… TikTok, Pinterest"
    [86.95, 91.4], // "siempre he preferido viajar… también es válido"
    [94.6, 102.1], // "acompáñame al tercer vídeo…"
  ],
};
