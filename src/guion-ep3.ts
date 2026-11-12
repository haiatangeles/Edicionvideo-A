import { Guion } from "./guion";

// Episodio 03: en qué gasto y en qué no (tiempos de la transcripción con Whisper).
// El vídeo ya trae al principio el gancho de la boda con su texto (0–4,69 s),
// así que el formato de la serie empieza justo después.
export const episodio3: Guion = {
  video: "episodio-3.mp4",
  duracionSeg: 87,

  gancho: {
    desde: 4.69,
    hasta: 7.7,
    antes: "planeando mi",
    titulo: "BODA EN PARÍS",
    pastilla: "¿low cost?",
  },

  intro: {
    desde: 7.7,
    hasta: 10.3,
    manuscrita: "bienvenida a",
    titulo: "EPISODIO 03",
    pastilla: "de mi boda en París",
  },

  // "...mi presupuesto es de 5.000 dólares" y "el venue me está costando como 2.500 euros"
  contadores: [
    {
      desde: 10.6,
      hasta: 14.7,
      antes: "mi presupuesto",
      cantidad: 5000,
      en: 12.7,
    },
    {
      desde: 27.9,
      hasta: 31.7, // a los 32 s entra la foto del alojamiento que puso ella
      antes: "el venue",
      cantidad: 2500,
      en: 29.8,
      moneda: "€",
    },
  ],

  titulos: [
    { desde: 14.9, hasta: 20.1, texto: "qué sí gasto\ny qué no", sticker: "" },
    {
      desde: 35.3,
      hasta: 42.6,
      texto: "las flores:\nprecios en París",
      sticker: "",
    },
    {
      desde: 42.9,
      hasta: 47.7,
      texto: "compra directo\na proveedores",
      sticker: "",
    },
    {
      desde: 47.9,
      hasta: 56.9,
      texto: "una decoradora cobra\nmucho más",
      sticker: "",
    },
    { desde: 57.3, hasta: 63.3, texto: "decoraré con mi familia", sticker: "" },
    { desde: 66.3, hasta: 72.8, texto: "«me encanta crear»", sticker: "" },
    {
      desde: 73.5,
      hasta: 79.5,
      texto: "como mi departamento\nen Perú",
      sticker: "",
    },
  ],

  // "Estoy gastando más que todo en el venue, las flores y telas"
  lista: {
    desde: 20.3,
    hasta: 27.8,
    titulo: "En qué gasto:",
    puntos: [
      { texto: "El venue", en: 22.6 },
      { texto: "Flores", en: 24.6 },
      { texto: "Telas", en: 25.2 },
    ],
  },

  // Sonidos solo en lo más importante
  sonidos: [
    { en: 4.69, archivo: "whoosh", volumen: 0.3 }, // del gancho de la boda al GRWM
    { en: 7.7, archivo: "whoosh", volumen: 0.3 }, // entra la tarjeta del episodio
    { en: 13.5, archivo: "ding", volumen: 0.35 }, // el contador llega a $5,000
    { en: 13.55, archivo: "brillos", volumen: 0.2 },
    { en: 22.6, archivo: "click", volumen: 0.4 }, // cada cosa de la lista
    { en: 24.6, archivo: "click", volumen: 0.4 },
    { en: 25.2, archivo: "click", volumen: 0.4 },
    { en: 30.6, archivo: "ding", volumen: 0.35 }, // el contador llega a 2.500 €
    { en: 67.1, archivo: "brillos", volumen: 0.2 }, // "me encanta"
    { en: 83.37, archivo: "click", volumen: 0.45 }, // pulsa "Seguir"
    { en: 83.42, archivo: "ding", volumen: 0.3 },
  ],

  // "...así que síganme para el siguiente vídeo"
  cierre: {
    desde: 82.3,
    titulo: "sígueme para el",
    destacado: "EPISODIO 04",
    boton: "Seguir",
    botonPulsado: "Siguiendo ✓",
  },
};
