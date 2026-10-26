import "@fontsource/pinyon-script/400.css";
import "@fontsource/montserrat/500-italic.css";
import "@fontsource/montserrat/600-italic.css";
import "@fontsource/montserrat/700-italic.css";

// Paleta de Color Palette (colores medidos en la imagen)
export const colores = {
  amarillo: "#FEEDAA",
  rosa: "#FCC0C5",
  marron: "#8B6852",
  nude: "#FFFAEB",
  fondo: "#F3EDDF",
  textoOscuro: "#5C2C20",
  blanco: "#FFFFFF",
};

export const fuentes = {
  caligrafica: "'Pinyon Script', cursive",
  texto: "Montserrat, Helvetica, sans-serif",
};

export const sombraSuave = "0 10px 30px rgba(92, 44, 32, 0.22)";
// Halo claro para que la letra caligráfica se lea encima del vídeo
export const halo = `0 0 24px ${colores.nude}, 0 0 12px ${colores.nude}, 0 0 5px ${colores.nude}, 0 0 2px ${colores.nude}`;
