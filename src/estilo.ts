import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

// Estilo: elegante sin parecer producido, minimalista, cálido y cercano.
// Tonos tierra suaves; el casi-negro solo para dar contraste al texto.
export const colores = {
  crema: "#F7F2EA", // blanco crema
  beige: "#E8DCCB", // beige cálido
  arena: "#D8C8B4",
  gris: "#BDB6AD", // gris suave
  tierra: "#A3846B", // tono tierra
  marron: "#6F5A49", // marrón neutro
  tinta: "#2A2420", // contraste
  blanco: "#FFFFFF",
};

export const fuentes = {
  texto: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

// Tarjeta crema translúcida con filete fino: el "banner" de todo el vídeo
export const tarjeta = {
  background: "rgba(247, 242, 234, 0.92)",
  border: `1px solid rgba(111, 90, 73, 0.28)`,
  borderRadius: 6,
  boxShadow: "0 12px 30px rgba(42, 36, 32, 0.12)",
} as const;
