// Guion de la edición (tiempos en segundos del vídeo original).
// Para cambiar un texto o un momento, se edita aquí.

export const VIDEO = "mi-video.mp4";
export const DURACION_SEG = 56.4;

export const gancho = {
  hasta: 2.8,
  antes: "planeando mi",
  titulo: "BODA EN PARÍS",
  pastilla: "¿low cost? 💸",
};

export const intro = {
  desde: 2.8,
  hasta: 5.8,
  manuscrita: "bienvenida a",
  titulo: "EPISODIO 01",
  pastilla: "de mi boda en París",
};

export const polaroid = { desde: 5.8, texto: "ep. 01 🤍" };

// Títulos didácticos arriba del todo
export const titulos: {
  desde: number;
  hasta: number;
  texto: string;
  color: "rosa" | "amarillo" | "blanco";
}[] = [
  { desde: 12, hasta: 16.5, texto: "✨ una boda bonita", color: "blanco" },
  { desde: 17, hasta: 21, texto: "💸 sin gastar de más", color: "amarillo" },
  { desde: 25, hasta: 31.5, texto: "👇 cómo voy a ahorrar", color: "rosa" },
  {
    desde: 32,
    hasta: 37,
    texto: "💗 gastar en lo importante",
    color: "blanco",
  },
];

export const lista = {
  desde: 37,
  hasta: 44,
  titulo: "Te voy a enseñar:",
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
  destacado: "EPISODIO 02 🤍",
};
