// Todo lo visual del vídeo se ajusta aquí. Cuando llegue estilo.md, se rellena con sus reglas.
export const estilo = {
  colores: {
    fondo: "#111111",
    texto: "#FFFFFF",
    destacado: "#FFD400", // palabra que se está diciendo
    contorno: "#000000",
    barra: "#FFD400",
  },
  fuente: "Arial Black, Helvetica, sans-serif",
  gancho: {
    texto: "Tu gancho aquí 👀",
    duracionSeg: 3,
    tamano: 96,
  },
  subtitulos: {
    tamano: 84,
    mayusculas: true,
    // Las palabras que estén a menos de esto (ms) se muestran juntas
    agruparMs: 900,
    // Distancia desde abajo (px)
    posicionAbajo: 520,
  },
  cierre: {
    texto: "Sígueme para más ➜",
    duracionSeg: 2.5,
  },
  barraProgreso: true,
} as const;
