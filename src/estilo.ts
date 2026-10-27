import "@fontsource/anton/400.css";
import "@fontsource/dancing-script/700.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/800.css";
import "@fontsource/cormorant-garamond/700-italic.css";
import "@fontsource/pinyon-script/400.css";

// Paleta vintage: rosas de la Colour Palette + oro del marco
export const colores = {
  rosaClaro: "#FDE7EA",
  rosa: "#E7B2B9",
  oroRosa: "#B76E79", // texto sobre el marco crema
  oro: "#C2A26B",
  crema: "#FBF5EA",
  blanco: "#FFFFFF",
};

// Tipografía: Anton/Dancing/Poppins (borrador 11) + Cormorant/Pinyon en los banners
export const fuentes = {
  titulo: "Anton, Impact, sans-serif",
  manuscrita: "'Dancing Script', cursive",
  texto: "Poppins, Helvetica, sans-serif",
  // Letras de los banners vintage (como el borrador 12)
  vintage: "'Cormorant Garamond', Georgia, serif",
  caligrafia: "'Pinyon Script', cursive",
};

export const sombraSuave = "0 10px 30px rgba(150, 110, 90, 0.28)";
export const halo = `0 0 14px ${colores.blanco}, 0 0 6px ${colores.blanco}, 0 0 2px ${colores.blanco}`;
