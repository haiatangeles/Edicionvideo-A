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
import { colores, fuentes, tarjeta } from "./estilo";
import { Previo } from "./guion";

// Aparece con un fundido suave y un pequeño deslizamiento (sin rebotes) y se desvanece al final
export const useAparecer = (retrasoFrames = 0, desplazamiento = 16) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const entrada = interpolate(
    frame,
    [retrasoFrames, retrasoFrames + 12],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  const salida = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return {
    opacity: entrada * salida,
    transform: `translateY(${(1 - entrada) * desplazamiento}px)`,
  };
};

// Etiqueta pequeña en mayúsculas espaciadas (estilo editorial)
export const Etiqueta: React.FC<{
  children: React.ReactNode;
  color?: string;
  tamano?: number;
  style?: React.CSSProperties;
}> = ({ children, color = colores.marron, tamano = 26, style }) => (
  <div
    style={{
      fontFamily: fuentes.texto,
      fontWeight: 500,
      fontSize: tamano,
      letterSpacing: tamano * 0.28,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

// Título fino y amplio
export const Titulo: React.FC<{
  children: React.ReactNode;
  tamano?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, tamano = 96, color = colores.tinta, style }) => (
  <div
    style={{
      fontFamily: fuentes.texto,
      fontWeight: 300,
      fontSize: tamano,
      lineHeight: 1.08,
      letterSpacing: -tamano * 0.01,
      color,
      whiteSpace: "pre-line",
      ...style,
    }}
  >
    {children}
  </div>
);

// Filete fino que se dibuja de izquierda a derecha
const Filete: React.FC<{ progreso: number; ancho: number; color?: string }> = ({
  progreso,
  ancho,
  color = colores.tierra,
}) => (
  <div
    style={{
      width: ancho * progreso,
      height: 1.5,
      background: color,
      margin: "18px auto",
    }}
  />
);

// Tarjeta crema centrada arriba
const Tarjeta: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      ...tarjeta,
      padding: "34px 56px",
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

export const FondoIntro: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => <AbsoluteFill style={{ backgroundColor: colores.beige, ...style }} />;

const useFilete = (desde: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [desde, desde + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

// Primer clip: "planeando mi BODA EN PARÍS · ¿low cost?"
export const Gancho: React.FC<{
  antes: string;
  titulo: string;
  pastilla: string;
}> = ({ antes, titulo, pastilla }) => {
  const a = useAparecer(0);
  const b = useAparecer(4);
  const c = useAparecer(12);
  const filete = useFilete(8);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
      <Tarjeta style={{ padding: "40px 70px 44px" }}>
        <div style={a}>
          <Etiqueta>{antes}</Etiqueta>
        </div>
        <div style={b}>
          <Titulo
            tamano={92}
            style={{
              marginTop: 12,
              textTransform: "uppercase",
              letterSpacing: 6,
            }}
          >
            {titulo}
          </Titulo>
        </div>
        <Filete progreso={filete} ancho={420} />
        <div style={c}>
          <Titulo
            tamano={44}
            color={colores.marron}
            style={{ fontWeight: 400 }}
          >
            {pastilla}
          </Titulo>
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

// Intro del episodio sobre beige cálido
export const TarjetaIntro: React.FC<{
  manuscrita: string;
  titulo: string;
  pastilla: string;
}> = ({ manuscrita, titulo, pastilla }) => {
  const a = useAparecer(4);
  const b = useAparecer(8);
  const c = useAparecer(14);
  const filete = useFilete(10);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
      <div style={a}>
        <Etiqueta>{manuscrita}</Etiqueta>
      </div>
      <div style={b}>
        <Titulo
          tamano={112}
          style={{
            marginTop: 14,
            textTransform: "uppercase",
            letterSpacing: 10,
          }}
        >
          {titulo}
        </Titulo>
      </div>
      <Filete progreso={filete} ancho={300} />
      <div style={c}>
        <Titulo tamano={36} color={colores.marron} style={{ fontWeight: 400 }}>
          {pastilla}
        </Titulo>
      </div>
    </AbsoluteFill>
  );
};

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
  const a = useAparecer(0);
  const b = useAparecer(4);
  const visible = useAparecer(0, 0).opacity;
  const p = interpolate(frame, [4, 4 + 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  // Arco suave por debajo de la tarjeta
  const ruta = (q: number) => ({
    x: 90 + q * 900,
    y: 560 - Math.sin(q * Math.PI) * 90,
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
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 }}>
        <Tarjeta>
          <div style={a}>
            <Etiqueta>{antes}</Etiqueta>
          </div>
          <div style={b}>
            <Titulo tamano={100} style={{ marginTop: 10 }}>
              {titulo}
            </Titulo>
          </div>
        </Tarjeta>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TituloDidactico: React.FC<{ texto: string; sticker?: string }> = ({
  texto,
}) => {
  const estilo = useAparecer(0);
  const largo = texto.length > 24;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 }}>
      <div style={estilo}>
        <Tarjeta style={{ maxWidth: 900 }}>
          <Titulo tamano={largo ? 58 : 66} style={{ fontWeight: 400 }}>
            {texto}
          </Titulo>
        </Tarjeta>
      </div>
    </AbsoluteFill>
  );
};

export const Lista: React.FC<{
  titulo: string;
  puntos: { texto: string; enFrames: number }[];
}> = ({ titulo, puntos }) => {
  const frame = useCurrentFrame();
  const estilo = useAparecer(0);
  return (
    <AbsoluteFill
      style={{ alignItems: "flex-end", paddingTop: 140, paddingRight: 60 }}
    >
      <div
        style={{ ...estilo, ...tarjeta, width: 560, padding: "34px 44px 26px" }}
      >
        <Etiqueta>{titulo.replace(":", "")}</Etiqueta>
        {/* Cada prioridad entra cuando la nombra; la tarjeta crece con ella */}
        {puntos
          .filter((p) => frame >= p.enFrames)
          .map((p, i) => {
            const s = interpolate(
              frame,
              [p.enFrames, p.enFrames + 10],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              },
            );
            return (
              <div
                key={p.texto}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 22,
                  padding: "16px 0",
                  borderTop:
                    i === 0 ? undefined : "1px solid rgba(111, 90, 73, 0.18)",
                  marginTop: i === 0 ? 14 : 0,
                  opacity: s,
                  transform: `translateX(${(1 - s) * 14}px)`,
                  fontFamily: fuentes.texto,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: colores.tierra,
                    letterSpacing: 2,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: 42,
                    fontWeight: 400,
                    color: colores.tinta,
                  }}
                >
                  {p.texto}
                </span>
              </div>
            );
          })}
      </div>
    </AbsoluteFill>
  );
};

export const Pregunta: React.FC<{ texto: string }> = ({ texto }) => {
  const estilo = useAparecer(0);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 }}>
      <div style={estilo}>
        <Tarjeta style={{ maxWidth: 900 }}>
          <Titulo tamano={60} style={{ fontWeight: 400 }}>
            {texto}
          </Titulo>
        </Tarjeta>
      </div>
    </AbsoluteFill>
  );
};

export const Comparativa: React.FC<{ altoEnFrames: number }> = ({
  altoEnFrames,
}) => {
  const bajo = useAparecer(0);
  const alto = useAparecer(altoEnFrames);
  const opciones: [string, React.CSSProperties][] = [
    ["Low cost", bajo],
    ["High cost", alto],
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 160 }}>
      <div style={{ display: "flex", gap: 24 }}>
        {opciones.map(([texto, estilo]) => (
          <div key={texto} style={estilo}>
            <Tarjeta style={{ padding: "30px 44px" }}>
              <Titulo tamano={60} style={{ fontWeight: 400 }}>
                {texto}
              </Titulo>
            </Tarjeta>
          </div>
        ))}
      </div>
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
  const estilo = useAparecer(0);
  const subir = interpolate(
    frame,
    [enFrames - 8, enFrames + 0.8 * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  const filete = useFilete(enFrames + Math.round(0.8 * fps));
  const valor = Math.round(cantidad * subir).toLocaleString("en-US");
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 }}>
      <div style={estilo}>
        <Tarjeta style={{ padding: "36px 80px 30px" }}>
          <Etiqueta>{antes}</Etiqueta>
          <Titulo
            tamano={140}
            style={{ marginTop: 8, fontVariantNumeric: "tabular-nums" }}
          >
            {`$${valor}`}
          </Titulo>
          <Filete progreso={filete} ancho={260} />
          {despues ? <Etiqueta tamano={22}>{despues}</Etiqueta> : null}
        </Tarjeta>
      </div>
    </AbsoluteFill>
  );
};

// Cierre: "sígueme para el EPISODIO 03" y el botón que pasa a "Siguiendo"
export const Cierre: React.FC<{
  titulo: string;
  destacado: string;
  boton: string;
  botonPulsado: string;
}> = ({ titulo, destacado, boton, botonPulsado }) => {
  const frame = useCurrentFrame();
  const estilo = useAparecer(0);
  const pulsado = frame >= 32; // coincide con el sonido del guion
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}>
      <div style={estilo}>
        <Tarjeta style={{ padding: "30px 60px 34px" }}>
          <Etiqueta>{titulo}</Etiqueta>
          <Titulo
            tamano={72}
            style={{
              marginTop: 10,
              textTransform: "uppercase",
              letterSpacing: 8,
            }}
          >
            {destacado}
          </Titulo>
          <div
            style={{
              display: "inline-block",
              marginTop: 22,
              padding: "12px 40px",
              borderRadius: 999,
              border: `1px solid ${colores.marron}`,
              background: pulsado ? colores.marron : "transparent",
              color: pulsado ? colores.crema : colores.marron,
              fontFamily: fuentes.texto,
              fontWeight: 500,
              fontSize: 28,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {pulsado ? botonPulsado : boton}
          </div>
        </Tarjeta>
      </div>
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
export const GanchoPrevio: React.FC<{ previo: Previo }> = ({ previo }) => {
  const a = useAparecer(0, 10);
  const b = useAparecer(3, 10);
  const c = useAparecer(8, 10);
  const filete = useFilete(5);
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(previo.video)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* Velo oscuro suave arriba: texto crema legible sobre cualquier toma */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(42,36,32,0.55) 0%, rgba(42,36,32,0.25) 30%, rgba(42,36,32,0) 48%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
        <div style={a}>
          <Etiqueta color={colores.beige} tamano={28}>
            {previo.antes}
          </Etiqueta>
        </div>
        <div style={b}>
          <Titulo
            tamano={104}
            color={colores.crema}
            style={{
              marginTop: 14,
              textTransform: "uppercase",
              letterSpacing: 8,
            }}
          >
            {previo.titulo}
          </Titulo>
        </div>
        <Filete progreso={filete} ancho={340} color={colores.beige} />
        <div style={c}>
          <Titulo tamano={44} color={colores.crema} style={{ fontWeight: 400 }}>
            {previo.banner}
          </Titulo>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
