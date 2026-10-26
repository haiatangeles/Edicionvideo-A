// Guion de la edición (tiempos en segundos del vídeo original).
// Para cambiar un texto, un momento o un sonido, se edita aquí.

export const VIDEO = "mi-video.mp4";
export const DURACION_SEG = 56.4;

export const gancho = {
  hasta: 2.8,
  antes: "planeando mi",
  titulo: "Boda en París",
  pastilla: "¿low cost? 💸",
};

export const intro = {
  desde: 2.8,
  hasta: 5.8,
  caligrafica: "bienvenida a",
  titulo: "Episodio 01",
  pastilla: "de mi boda en París",
};

// Momento "quiero una boda tipo Vogue": brillos (visual + sonido)
export const vogue = { desde: 9.5, hasta: 12.3, texto: "tipo Vogue" };

// Zoom suave en cada cambio de idea (1 = sin zoom)
export const zooms: { en: number; escala: number }[] = [
  { en: 0, escala: 1.0 },
  { en: 12, escala: 1.12 },
  { en: 17, escala: 1.0 },
  { en: 25, escala: 1.12 },
  { en: 32, escala: 1.0 },
  { en: 37, escala: 1.1 },
  { en: 44, escala: 1.0 },
  { en: 49, escala: 1.12 },
  { en: 54, escala: 1.0 },
];

// Títulos didácticos arriba del todo
export const titulos: {
  desde: number;
  hasta: number;
  texto: string;
  color: "rosa" | "amarillo" | "nude";
}[] = [
  { desde: 12.3, hasta: 16.3, texto: "✨ una boda bonita", color: "nude" },
  { desde: 25, hasta: 31.5, texto: "👇 cómo voy a ahorrar", color: "rosa" },
  {
    desde: 32,
    hasta: 37,
    texto: "💗 gastar en lo importante",
    color: "amarillo",
  },
];

// "...prefiero gastarlo en viajes": avión cruzando la pantalla
export const viajes = { desde: 17, hasta: 21.5, texto: "viajes" };

export const lista = {
  desde: 37,
  hasta: 44,
  titulo: "te voy a enseñar",
  puntos: [
    { texto: "Todo el proceso", en: 37.3 },
    { texto: "Los precios", en: 39.8 },
    { texto: "Proveedores", en: 41 },
  ],
};

export const pregunta = {
  desde: 44.5,
  hasta: 49,
  texto: "¿Se puede tener una boda en París?",
};

export const comparativa = { desde: 49, hasta: 54, low: 49.3, high: 52.2 };

export const cierre = {
  desde: 54,
  titulo: "sígueme para el",
  destacado: "Episodio 02 🤍",
};

// Efectos de sonido (archivos en public/sfx, generados con scripts/crear-sonidos.py)
export const sonidos: { en: number; archivo: string; volumen: number }[] = [
  { en: 0.15, archivo: "whoosh", volumen: 0.35 },
  { en: 0.5, archivo: "pop", volumen: 0.4 },
  { en: 2.8, archivo: "whoosh", volumen: 0.35 },
  { en: 3.2, archivo: "pop", volumen: 0.35 },
  { en: vogue.desde, archivo: "brillos", volumen: 0.45 },
  { en: vogue.desde + 1.2, archivo: "brillos", volumen: 0.3 },
  { en: 12.3, archivo: "pop", volumen: 0.35 },
  { en: viajes.desde, archivo: "avion", volumen: 0.4 },
  { en: viajes.desde + 0.4, archivo: "pop", volumen: 0.3 },
  { en: 25, archivo: "pop", volumen: 0.35 },
  { en: 32, archivo: "pop", volumen: 0.35 },
  { en: 37, archivo: "whoosh", volumen: 0.35 },
  ...lista.puntos.map((p) => ({ en: p.en, archivo: "click", volumen: 0.45 })),
  { en: pregunta.desde, archivo: "ding", volumen: 0.3 },
  { en: comparativa.low, archivo: "pop", volumen: 0.4 },
  { en: comparativa.high, archivo: "pop", volumen: 0.4 },
  { en: comparativa.high + 0.1, archivo: "brillos", volumen: 0.25 },
  { en: cierre.desde, archivo: "ding", volumen: 0.3 },
  { en: cierre.desde + 0.3, archivo: "brillos", volumen: 0.25 },
];
