// Todo lo visual del vídeo se ajusta aquí. Cuando llegue estilo.md, se rellena con sus reglas.
export const estilo = {
  colores: {
    // Paleta pedida: rosa, blanco, beige y amarillo suave
    fondo: "#F5E9DA", // beige
    texto: "#FFFFFF", // blanco
    destacado: "#F4A6C1", // rosa: palabra que se está diciendo
    acento: "#F6E3A1", // amarillo suave
    contorno: "#5A4A42", // marrón suave en lugar de negro
    barra: "#F4A6C1",
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
