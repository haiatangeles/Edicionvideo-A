import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colores, fuentes, sombraTexto } from "./estilo";
import { Previo } from "./guion";

const suave = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.cubic),
} as const;

// Fundido de salida al final de la Sequence que lo contiene
const useSalida = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// Aparece con un fundido y un pequeño deslizamiento
export const useAparecer = (retrasoFrames = 0, desplazamiento = 16) => {
  const frame = useCurrentFrame();
  const salida = useSalida();
  const entrada = interpolate(
    frame,
    [retrasoFrames, retrasoFrames + 12],
    [0, 1],
    suave,
  );
  return {
    opacity: entrada * salida,
    transform: `translateY(${(1 - entrada) * desplazamiento}px)`,
  };
};

// Velo oscuro muy suave arriba para que el texto crema se lea sobre el vídeo
const Velo: React.FC<{ alto?: number }> = ({ alto = 45 }) => {
  const frame = useCurrentFrame();
  const salida = useSalida();
  const entrada = interpolate(frame, [0, 10], [0, 1], suave);
  return (
    <AbsoluteFill
      style={{
        opacity: entrada * salida,
        background: `linear-gradient(180deg, rgba(42,36,32,0.55) 0%, rgba(42,36,32,0.28) ${alto * 0.55}%, rgba(42,36,32,0) ${alto}%)`,
      }}
    />
  );
};

// Las palabras aparecen una a una: suben y pasan de desenfocadas a nítidas
const Revelar: React.FC<{ texto: string; retraso?: number; paso?: number }> = ({
  texto,
  retraso = 0,
  paso = 4,
}) => {
  const frame = useCurrentFrame();
  const lineas = texto.split("\n");
  let i = 0;
  return (
    <>
      {lineas.map((linea, l) => (
        <div key={l}>
          {linea.split(" ").map((palabra, w) => {
            const desde = retraso + i++ * paso;
            const p = interpolate(frame, [desde, desde + 14], [0, 1], suave);
            return (
              <span
                key={w}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 34}px)`,
                  filter: `blur(${(1 - p) * 8}px)`,
                }}
              >
                {w > 0 ? " " : ""}
                {palabra}
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
};

// Línea pequeña en mayúsculas espaciadas (como "BRUNCH, SHOPPING, CENA")
export const Etiqueta: React.FC<{
  children: React.ReactNode;
  color?: string;
  tamano?: number;
  style?: React.CSSProperties;
}> = ({ children, color = colores.crema, tamano = 28, style }) => (
  <div
    style={{
      fontFamily: fuentes.texto,
      fontWeight: 400,
      fontSize: tamano,
      letterSpacing: tamano * 0.22,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

// Título en serif de alto contraste
export const Titulo: React.FC<{
  children: React.ReactNode;
  tamano?: number;
  color?: string;
  cursiva?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  tamano = 120,
  color = colores.crema,
  cursiva = false,
  style,
}) => (
  <div
    style={{
      fontFamily: fuentes.titulo,
      fontStyle: cursiva ? "italic" : "normal",
      fontSize: tamano,
      lineHeight: 0.98,
      letterSpacing: -tamano * 0.012,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

// Bloque de título sobre el vídeo: etiqueta + título que se revela + línea en cursiva
const Bloque: React.FC<{
  etiqueta?: string;
  titulo: string;
  tamano?: number;
  pie?: string;
  color?: string;
  sombra?: boolean;
  paddingTop?: number;
}> = ({
  etiqueta,
  titulo,
  tamano = 120,
  pie,
  color = colores.crema,
  sombra = true,
  paddingTop = 150,
}) => {
  const a = useAparecer(0, 10);
  const salida = useSalida();
  const c = useAparecer(6 + titulo.split(" ").length * 4, 10);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        paddingTop,
        textAlign: "center",
        textShadow: sombra ? sombraTexto : "none",
      }}
    >
      {etiqueta ? (
        <div style={a}>
          <Etiqueta color={color} style={{ marginBottom: 18 }}>
            {etiqueta}
          </Etiqueta>
        </div>
      ) : null}
      <div style={{ opacity: salida }}>
        <Titulo tamano={tamano} color={color}>
          <Revelar texto={titulo} retraso={4} />
        </Titulo>
      </div>
      {pie ? (
        <div style={c}>
          <Titulo
            tamano={tamano * 0.5}
            color={color}
            cursiva
            style={{ marginTop: 16 }}
          >
            {pie}
          </Titulo>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const FondoIntro: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => <AbsoluteFill style={{ backgroundColor: colores.beige, ...style }} />;

// Primer clip: "planeando mi · Boda en París · ¿low cost?"
export const Gancho: React.FC<{
  antes: string;
  titulo: string;
  pastilla: string;
}> = ({ antes, titulo, pastilla }) => (
  <AbsoluteFill>
    <Velo />
    <Bloque
      etiqueta={antes}
      titulo={titulo
        .toLowerCase()
        .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
        .replace(" En ", " en ")}
      tamano={128}
      pie={pastilla}
    />
  </AbsoluteFill>
);

// Intro del episodio sobre beige cálido, texto oscuro
export const TarjetaIntro: React.FC<{
  manuscrita: string;
  titulo: string;
  pastilla: string;
}> = ({ manuscrita, titulo, pastilla }) => (
  <Bloque
    etiqueta={manuscrita}
    titulo={titulo.charAt(0) + titulo.slice(1).toLowerCase()}
    tamano={140}
    pie={pastilla}
    color={colores.tinta}
    sombra={false}
    paddingTop={110}
  />
);

// Línea fina con un avión pequeño que cruza mientras dice "viajar"
const Avion: React.FC = () => (
  <svg viewBox="0 0 100 100" width={56} height={56}>
    <path
      d="M50 5 C54 5 56 10 56 16 L56 38 L92 58 L92 66 L56 55 L56 78 L68 87 L68 93 L50 88 L32 93 L32 87 L44 78 L44 55 L8 66 L8 58 L44 38 L44 16 C44 10 46 5 50 5Z"
      fill={colores.crema}
      stroke={colores.marron}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  </svg>
);

export const Viajes: React.FC<{ antes: string; titulo: string }> = ({
  antes,
  titulo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const visible = useSalida();
  const p = interpolate(frame, [4, 4 + 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const ruta = (q: number) => ({
    x: 90 + q * 900,
    y: 600 - Math.sin(q * Math.PI) * 90,
  });
  const pos = ruta(p);
  const delante = ruta(Math.min(1, p + 0.01));
  const angulo =
    (Math.atan2(delante.y - pos.y, delante.x - pos.x) * 180) / Math.PI + 90;
  const puntos = new Array(60)
    .fill(0)
    .map((_, i) => ruta((i / 60) * p))
    .map((d) => `${d.x},${d.y}`)
    .join(" ");
  return (
    <AbsoluteFill>
      <Velo />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", opacity: visible }}
      >
        <polyline
          points={puntos}
          fill="none"
          stroke={colores.crema}
          strokeWidth={2.5}
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
      </svg>
      {p > 0 ? (
        <div
          style={{
            position: "absolute",
            left: pos.x - 28,
            top: pos.y - 28,
            opacity: visible,
            transform: `rotate(${angulo}deg)`,
          }}
        >
          <Avion />
        </div>
      ) : null}
      <Bloque etiqueta={antes} titulo={titulo} tamano={150} />
    </AbsoluteFill>
  );
};

export const TituloDidactico: React.FC<{ texto: string; sticker?: string }> = ({
  texto,
}) => (
  <AbsoluteFill>
    <Velo />
    <Bloque titulo={texto} tamano={texto.length > 24 ? 92 : 118} />
  </AbsoluteFill>
);

export const Lista: React.FC<{
  titulo: string;
  puntos: { texto: string; enFrames: number }[];
}> = ({ titulo, puntos }) => {
  const frame = useCurrentFrame();
  const salida = useSalida();
  const a = useAparecer(0, 10);
  return (
    <AbsoluteFill>
      <Velo alto={55} />
      <AbsoluteFill
        style={{
          paddingTop: 140,
          paddingLeft: 90,
          textShadow: sombraTexto,
          opacity: salida,
        }}
      >
        <div style={a}>
          <Etiqueta style={{ marginBottom: 20 }}>
            {titulo.replace(":", "")}
          </Etiqueta>
        </div>
        {/* Cada prioridad entra cuando la nombra */}
        {puntos.map((p, i) => {
          const s = interpolate(
            frame,
            [p.enFrames, p.enFrames + 14],
            [0, 1],
            suave,
          );
          return (
            <div
              key={p.texto}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 26,
                marginTop: 6,
                opacity: s,
                transform: `translateX(${(1 - s) * -24}px)`,
                filter: `blur(${(1 - s) * 6}px)`,
              }}
            >
              <Titulo tamano={46} cursiva color={colores.beige}>
                {String(i + 1).padStart(2, "0")}
              </Titulo>
              <Titulo tamano={76}>{p.texto}</Titulo>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Pregunta: React.FC<{ texto: string }> = ({ texto }) => (
  <AbsoluteFill>
    <Velo />
    <Bloque titulo={texto} tamano={96} />
  </AbsoluteFill>
);

export const Comparativa: React.FC<{ altoEnFrames: number }> = ({
  altoEnFrames,
}) => {
  const bajo = useAparecer(0);
  const alto = useAparecer(altoEnFrames);
  return (
    <AbsoluteFill>
      <Velo />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 170,
          textShadow: sombraTexto,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 30 }}>
          <div style={bajo}>
            <Titulo tamano={100}>Low cost</Titulo>
          </div>
          <div style={alto}>
            <Titulo tamano={56} cursiva color={colores.beige}>
              vs
            </Titulo>
          </div>
          <div style={alto}>
            <Titulo tamano={100}>High cost</Titulo>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Cifra que sube de 0 a la cantidad justo cuando se dice
export const Contador: React.FC<{
  antes: string;
  cantidad: number;
  enFrames: number;
  despues?: string;
}> = ({ antes, cantidad, enFrames, despues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useAparecer(0, 10);
  const b = useAparecer(4, 24);
  const subir = interpolate(
    frame,
    [enFrames - 8, enFrames + 0.8 * fps],
    [0, 1],
    suave,
  );
  // Al llegar a la cifra, un pequeño "latido" de escala
  const latido = interpolate(
    frame,
    [enFrames + 0.8 * fps, enFrames + 0.8 * fps + 6, enFrames + 0.8 * fps + 16],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const valor = Math.round(cantidad * subir).toLocaleString("en-US");
  return (
    <AbsoluteFill>
      <Velo />
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 150,
          textShadow: sombraTexto,
        }}
      >
        <div style={a}>
          <Etiqueta style={{ marginBottom: 14 }}>{antes}</Etiqueta>
        </div>
        <div style={{ ...b, transform: `${b.transform} scale(${latido})` }}>
          <Titulo tamano={200} style={{ fontVariantNumeric: "tabular-nums" }}>
            {`$${valor}`}
          </Titulo>
        </div>
        {despues ? (
          <Titulo tamano={52} cursiva style={{ marginTop: 10 }}>
            {despues}
          </Titulo>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Cierre: "sígueme para el · Episodio 03" y el botón que pasa a "Siguiendo"
export const Cierre: React.FC<{
  titulo: string;
  destacado: string;
  boton: string;
  botonPulsado: string;
}> = ({ titulo, destacado, boton, botonPulsado }) => {
  const frame = useCurrentFrame();
  const c = useAparecer(14, 10);
  const pulsado = frame >= 32; // coincide con el sonido del guion
  return (
    <AbsoluteFill>
      <Velo />
      <Bloque
        etiqueta={titulo}
        titulo={destacado.charAt(0) + destacado.slice(1).toLowerCase()}
        tamano={130}
        paddingTop={120}
      />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 390 }}>
        <div
          style={{
            ...c,
            padding: "14px 46px",
            borderRadius: 999,
            border: `1.5px solid ${colores.crema}`,
            background: pulsado ? colores.crema : "rgba(42,36,32,0.15)",
            color: pulsado ? colores.marron : colores.crema,
            fontFamily: fuentes.texto,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {pulsado ? botonPulsado : boton}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BarraProgreso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 6,
        background: "rgba(247, 242, 234, 0.45)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${(frame / (durationInFrames - 1)) * 100}%`,
          background: colores.tierra,
        }}
      />
    </div>
  );
};

// Gancho visual: el resultado final de la boda con el texto desde el primer segundo
export const GanchoPrevio: React.FC<{ previo: Previo }> = ({ previo }) => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile(previo.video)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Velo alto={50} />
    <Bloque
      etiqueta={previo.antes}
      titulo={previo.titulo
        .toLowerCase()
        .replace(/(^|\s)\S/g, (l) => l.toUpperCase())
        .replace(" En ", " en ")}
      tamano={136}
      pie={previo.banner}
      paddingTop={120}
    />
  </AbsoluteFill>
);
