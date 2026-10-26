import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colores, fuentes, halo, sombraSuave } from "./estilo";

// Entrada con rebote y salida suave, relativa a la Sequence que lo contiene
export const useEntradaSalida = (retrasoFrames = 0) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrada = spring({
    frame: frame - retrasoFrames,
    fps,
    config: { damping: 11, stiffness: 140 },
  });
  const salida = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return { entrada, salida, opacidad: Math.min(1, entrada * 1.5) * salida };
};

export const FondoPuntos: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: colores.rosa,
      backgroundImage: `radial-gradient(${colores.marron} 9px, transparent 10px), radial-gradient(${colores.nude} 7px, transparent 8px)`,
      backgroundSize: "260px 300px, 190px 230px",
      backgroundPosition: "40px 60px, 150px 170px",
      ...style,
    }}
  />
);

export const Pastilla: React.FC<{
  children: React.ReactNode;
  fondo?: string;
  color?: string;
  tamano?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  fondo = colores.marron,
  color = colores.nude,
  tamano = 40,
  style,
}) => (
  <span
    style={{
      display: "inline-block",
      background: fondo,
      color,
      fontFamily: fuentes.texto,
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: tamano,
      padding: `${tamano * 0.25}px ${tamano * 0.6}px`,
      borderRadius: 999,
      boxShadow: sombraSuave,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

// Título grande en caligráfica (como "Color Palette")
export const TituloGrande: React.FC<{
  children: React.ReactNode;
  tamano?: number;
  style?: React.CSSProperties;
}> = ({ children, tamano = 170, style }) => (
  <div
    style={{
      fontFamily: fuentes.caligrafica,
      fontSize: tamano,
      color: colores.marron,
      WebkitTextStroke: `${Math.max(1.5, tamano / 70)}px ${colores.marron}`,
      lineHeight: 1.15,
      textShadow: halo,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// Texto pequeño en itálica (como "Yellow #FEEDAA")
export const Italica: React.FC<{
  children: React.ReactNode;
  tamano?: number;
  style?: React.CSSProperties;
}> = ({ children, tamano = 48, style }) => (
  <div
    style={{
      fontFamily: fuentes.texto,
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: tamano,
      color: colores.textoOscuro,
      textShadow: halo,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Gancho: React.FC<{
  antes: string;
  titulo: string;
  pastilla: string;
}> = ({ antes, titulo, pastilla }) => {
  const a = useEntradaSalida(0);
  const b = useEntradaSalida(5);
  const c = useEntradaSalida(14);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
      <Italica
        style={{
          opacity: a.opacidad,
          transform: `translateY(${(1 - a.entrada) * 40}px)`,
        }}
      >
        {antes}
      </Italica>
      <TituloGrande
        style={{
          opacity: b.opacidad,
          transform: `scale(${0.6 + b.entrada * 0.4})`,
        }}
      >
        {titulo}
      </TituloGrande>
      <div
        style={{
          marginTop: 10,
          opacity: c.opacidad,
          transform: `scale(${c.entrada}) rotate(-3deg)`,
        }}
      >
        <Pastilla
          fondo={colores.amarillo}
          color={colores.textoOscuro}
          tamano={54}
        >
          {pastilla}
        </Pastilla>
      </div>
    </AbsoluteFill>
  );
};

export const TarjetaIntro: React.FC<{
  caligrafica: string;
  titulo: string;
  pastilla: string;
}> = ({ caligrafica, titulo, pastilla }) => {
  const a = useEntradaSalida(3);
  const b = useEntradaSalida(12);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}>
      <Italica style={{ opacity: a.opacidad }}>{caligrafica}</Italica>
      <TituloGrande
        tamano={160}
        style={{
          opacity: a.opacidad,
          transform: `scale(${0.7 + a.entrada * 0.3})`,
        }}
      >
        {titulo}
      </TituloGrande>
      <div
        style={{
          marginLeft: 260,
          opacity: b.opacidad,
          transform: `scale(${b.entrada}) rotate(-4deg)`,
        }}
      >
        <Pastilla tamano={34}>{pastilla}</Pastilla>
      </div>
    </AbsoluteFill>
  );
};

// Destellos que aparecen y desaparecen por la pantalla
export const Brillos: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const { entrada, opacidad } = useEntradaSalida(0);
  const estrellas = new Array(30).fill(0).map((_, i) => {
    const x = random(`x${i}`) * 1000 + 40;
    const y = random(`y${i}`) * 1000 + 150;
    const inicio = random(`d${i}`) * 50;
    const vida = 22 + random(`v${i}`) * 18;
    const p = (frame - inicio) / vida;
    const s = p < 0 || p > 1 ? 0 : Math.sin(p * Math.PI);
    const tam = 50 + random(`t${i}`) * 80;
    const color = [colores.amarillo, colores.nude, colores.rosa][i % 3];
    return (
      <svg
        key={i}
        viewBox="-50 -50 100 100"
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: tam,
          height: tam,
          transform: `scale(${s}) rotate(${frame * 3}deg)`,
          filter: `drop-shadow(0 0 10px ${colores.amarillo})`,
        }}
      >
        <path
          d="M0,-50 C6,-6 6,-6 50,0 C6,6 6,6 0,50 C-6,6 -6,6 -50,0 C-6,-6 -6,-6 0,-50Z"
          fill={color}
        />
      </svg>
    );
  });
  return (
    <AbsoluteFill>
      {estrellas}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        <TituloGrande
          tamano={180}
          style={{
            opacity: opacidad,
            transform: `scale(${0.5 + entrada * 0.5})`,
          }}
        >
          {texto}
        </TituloGrande>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Avioncito: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 100 100" width={170} height={170}>
    <path
      d="M50 5 C54 5 56 10 56 16 L56 38 L92 58 L92 66 L56 55 L56 78 L68 87 L68 93 L50 88 L32 93 L32 87 L44 78 L44 55 L8 66 L8 58 L44 38 L44 16 C44 10 46 5 50 5Z"
      fill={color}
      stroke={colores.nude}
      strokeWidth={2.5}
    />
  </svg>
);

// Avión que cruza la pantalla dejando una estela punteada
export const Viajes: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { entrada, opacidad } = useEntradaSalida(6);
  const p = interpolate(frame, [0, 2.6 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ruta = (q: number) => ({
    x: -150 + q * 1380,
    y: 640 - Math.sin(q * Math.PI) * 360 - q * 120,
  });
  const pos = ruta(p);
  const delante = ruta(Math.min(1, p + 0.01));
  const angulo =
    (Math.atan2(delante.y - pos.y, delante.x - pos.x) * 180) / Math.PI + 90;
  const puntos = new Array(40)
    .fill(0)
    .map((_, i) => i / 40)
    .filter((q) => q < p - 0.03)
    .map((q) => ruta(q));
  return (
    <AbsoluteFill
      style={{
        opacity: opacidad > 0 ? Math.max(opacidad, entrada > 0 ? 1 : 0) : 0,
      }}
    >
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {puntos.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={7}
            fill={colores.nude}
            stroke={colores.marron}
            strokeWidth={2}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: pos.x - 85,
          top: pos.y - 85,
          transform: `rotate(${angulo}deg)`,
        }}
      >
        <Avioncito color={colores.marron} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
        <div
          style={{
            opacity: opacidad,
            transform: `scale(${entrada}) rotate(-3deg)`,
          }}
        >
          <Pastilla
            fondo={colores.amarillo}
            color={colores.textoOscuro}
            tamano={64}
          >
            ✈️ {texto}
          </Pastilla>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const fondoPorColor = {
  rosa: colores.rosa,
  amarillo: colores.amarillo,
  nude: colores.nude,
};

export const TituloDidactico: React.FC<{
  texto: string;
  color: keyof typeof fondoPorColor;
}> = ({ texto, color }) => {
  const { entrada, opacidad } = useEntradaSalida(0);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
      <div
        style={{
          opacity: opacidad,
          transform: `translateY(${(1 - entrada) * -60}px) rotate(-2deg)`,
        }}
      >
        <Pastilla
          fondo={fondoPorColor[color]}
          color={colores.textoOscuro}
          tamano={60}
        >
          {texto}
        </Pastilla>
      </div>
    </AbsoluteFill>
  );
};

export const Lista: React.FC<{
  titulo: string;
  puntos: { texto: string; enFrames: number }[];
}> = ({ titulo, puntos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { entrada, opacidad } = useEntradaSalida(0);
  return (
    <div
      style={{
        position: "absolute",
        right: 60,
        top: 150,
        width: 580,
        padding: "26px 40px 34px",
        background: colores.nude,
        borderRadius: 36,
        border: `5px solid ${colores.blanco}`,
        boxShadow: sombraSuave,
        opacity: opacidad,
        transform: `translateX(${(1 - entrada) * 300}px) rotate(2deg)`,
      }}
    >
      <TituloGrande tamano={84} style={{ textShadow: "none" }}>
        {titulo}
      </TituloGrande>
      {puntos.map((p, i) => {
        const s = spring({
          frame: frame - p.enFrames,
          fps,
          config: { damping: 12 },
        });
        return (
          <div
            key={p.texto}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 18,
              opacity: s,
              transform: `translateX(${(1 - s) * 60}px)`,
            }}
          >
            <span
              style={{
                width: 62,
                height: 62,
                borderRadius: 999,
                background: i % 2 ? colores.amarillo : colores.rosa,
                color: colores.textoOscuro,
                fontFamily: fuentes.texto,
                fontStyle: "italic",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <Italica
              tamano={46}
              style={{ textShadow: "none", fontWeight: 600 }}
            >
              {p.texto}
            </Italica>
          </div>
        );
      })}
    </div>
  );
};

export const Pregunta: React.FC<{ texto: string }> = ({ texto }) => {
  const { entrada, opacidad } = useEntradaSalida(0);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
      <div
        style={{
          width: 920,
          textAlign: "center",
          padding: "26px 40px 34px",
          background: colores.nude,
          borderRadius: 40,
          border: `5px solid ${colores.blanco}`,
          boxShadow: sombraSuave,
          opacity: opacidad,
          transform: `scale(${0.7 + entrada * 0.3})`,
        }}
      >
        <Italica tamano={58} style={{ textShadow: "none", fontWeight: 600 }}>
          {texto}
        </Italica>
      </div>
    </AbsoluteFill>
  );
};

export const Comparativa: React.FC<{ altoEnFrames: number }> = ({
  altoEnFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { entrada, opacidad } = useEntradaSalida(0);
  const alto = spring({
    frame: frame - altoEnFrames,
    fps,
    config: { damping: 11 },
  });
  const tarjeta = (titulo: string, fondo: string, s: number, giro: number) => (
    <div
      style={{
        width: 400,
        padding: "24px 0",
        textAlign: "center",
        background: fondo,
        borderRadius: 32,
        border: `5px solid ${colores.blanco}`,
        boxShadow: sombraSuave,
        transform: `scale(${s}) rotate(${giro}deg)`,
        opacity: Math.min(1, s * 1.5),
      }}
    >
      <Italica tamano={62} style={{ textShadow: "none", fontWeight: 700 }}>
        {titulo}
      </Italica>
    </div>
  );
  return (
    <AbsoluteFill
      style={{ paddingTop: 180, alignItems: "center", opacity: opacidad }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {tarjeta("low cost", colores.amarillo, entrada, -3)}
        <TituloGrande tamano={100} style={{ opacity: alto }}>
          vs
        </TituloGrande>
        {tarjeta("high cost", colores.rosa, alto, 3)}
      </div>
    </AbsoluteFill>
  );
};

export const Cierre: React.FC<{ titulo: string; destacado: string }> = ({
  titulo,
  destacado,
}) => {
  const { entrada } = useEntradaSalida(0);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 180 }}>
      <div
        style={{
          textAlign: "center",
          padding: "24px 70px 30px",
          background: colores.nude,
          borderRadius: 44,
          border: `6px solid ${colores.blanco}`,
          boxShadow: sombraSuave,
          transform: `translateY(${(1 - entrada) * -200}px)`,
        }}
      >
        <Italica style={{ textShadow: "none" }}>{titulo}</Italica>
        <TituloGrande tamano={140} style={{ textShadow: "none" }}>
          {destacado}
        </TituloGrande>
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
        height: 16,
        background: `${colores.nude}88`,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${(frame / (durationInFrames - 1)) * 100}%`,
          background: `linear-gradient(90deg, ${colores.rosa}, ${colores.amarillo})`,
        }}
      />
    </div>
  );
};
