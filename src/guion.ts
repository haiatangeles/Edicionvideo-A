// Guion de cada episodio (tiempos en segundos del vídeo original).
// Para cambiar un texto o un momento, se edita aquí.

type Tramo = { desde: number; hasta: number };

// Gancho visual antes del vídeo principal (el resultado final primero)
export type Previo = {
  video: string;
  duracionSeg: number;
  antes: string; // texto pequeño en manuscrita
  titulo: string; // texto grande
  banner: string; // texto del banner vintage
};

export type Guion = {
  previo?: Previo;
  video: string;
  duracionSeg: number;
  gancho: { hasta: number; antes: string; titulo: string; pastilla: string };
  intro: Tramo & { manuscrita: string; titulo: string; pastilla: string };
  viajes?: Tramo & { antes: string; titulo: string };
  titulos: (Tramo & { texto: string; sticker: string })[];
  contador?: Tramo & {
    antes: string;
    cantidad: number;
    en: number;
    despues?: string;
  };
  lista?: Tramo & { titulo: string; puntos: { texto: string; en: number }[] };
  pregunta?: Tramo & { texto: string };
  comparativa?: Tramo & { low: number; high: number };
  cierre: {
    desde: number;
    titulo: string;
    destacado: string;
    boton: string;
    botonPulsado: string;
  };
  // Efectos de sonido (archivos en public/sfx), solo en los momentos importantes
  sonidos?: { en: number; archivo: string; volumen: number }[];
  // Partes del vídeo original que se quedan (en segundos). Sin cortes = vídeo entero.
  cortes?: [number, number][];
};

// Cuánto dura el vídeo editado
export const duracionSalida = (guion: Guion) =>
  (guion.cortes ?? [[0, guion.duracionSeg]]).reduce(
    (t, [a, b]) => t + b - a,
    0,
  );

// Duración total, con el gancho previo si lo hay
export const duracionTotal = (guion: Guion) =>
  (guion.previo?.duracionSeg ?? 0) + duracionSalida(guion);

// Pasa un tiempo del vídeo original al vídeo editado (lo cortado se "pega" al siguiente tramo)
export const tiempoSalida = (guion: Guion, t: number) => {
  let acumulado = 0;
  for (const [a, b] of guion.cortes ?? [[0, guion.duracionSeg]]) {
    if (t <= a) return acumulado;
    if (t < b) return acumulado + (t - a);
    acumulado += b - a;
  }
  return acumulado;
};

export const episodio1: Guion = {
  video: "mi-video.mp4",
  duracionSeg: 56.4,

  gancho: {
    hasta: 2.8,
    antes: "planeando mi",
    titulo: "BODA EN PARÍS",
    pastilla: "¿low cost?",
  },

  intro: {
    desde: 2.8,
    hasta: 5.8,
    manuscrita: "bienvenida a",
    titulo: "EPISODIO 01",
    pastilla: "de mi boda en París",
  },

  // "...prefiero gastarlo en viajes": solo mientras lo dice (a los 20 s entran sus fotos de bodas)
  viajes: {
    desde: 18.9,
    hasta: 20.2,
    antes: "prefiero gastarlo en",
    titulo: "viajes",
  },

  // Títulos didácticos arriba del todo
  titulos: [
    { desde: 12.3, hasta: 16.5, texto: "una boda bonita", sticker: "vestido" },
    {
      desde: 16.7,
      hasta: 18.8,
      texto: "sin gastar de más",
      sticker: "anillos",
    },
    { desde: 25, hasta: 31.5, texto: "cómo voy a ahorrar", sticker: "pastel" },
    {
      desde: 32,
      hasta: 37,
      texto: "gastar en lo importante",
      sticker: "rosas",
    },
  ],

  lista: {
    desde: 37,
    hasta: 44,
    titulo: "Te voy a enseñar:",
    puntos: [
      { texto: "Todo el proceso", en: 37.3 },
      { texto: "Los precios", en: 39.8 },
      { texto: "Proveedores", en: 41 },
    ],
  },

  pregunta: {
    desde: 44.5,
    hasta: 49,
    texto: "¿Se puede tener una boda en París?",
  },

  comparativa: { desde: 49, hasta: 54, low: 49.3, high: 52.2 },

  cierre: {
    desde: 54,
    titulo: "sígueme para el",
    destacado: "EPISODIO 02",
    boton: "Seguir",
    botonPulsado: "Siguiendo ✓",
  },
};
