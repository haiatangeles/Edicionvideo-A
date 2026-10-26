import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colores, fuentes, sombraSuave } from "./estilo";

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
      backgroundImage: `radial-gradient(${colores.amarillo} 10px, transparent 11px), radial-gradient(${colores.beige} 7px, transparent 8px)`,
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
  fondo = colores.granate,
  color = colores.blanco,
  tamano = 40,
  style,
}) => (
  <span
    style={{
      display: "inline-block",
      background: fondo,
      color,
      fontFamily: fuentes.texto,
      fontWeight: 800,
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

export const TituloGrande: React.FC<{
  children: React.ReactNode;
  tamano?: number;
  style?: React.CSSProperties;
}> = ({ children, tamano = 150, style }) => (
  <div
    style={{
      fontFamily: fuentes.titulo,
      fontSize: tamano,
      color: colores.granate,
      lineHeight: 1,
      letterSpacing: 2,
      textShadow: `5px 5px 0 ${colores.blanco}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Manuscrita: React.FC<{
  children: React.ReactNode;
  tamano?: number;
  style?: React.CSSProperties;
}> = ({ children, tamano = 70, style }) => (
  <div
    style={{
      fontFamily: fuentes.manuscrita,
      fontWeight: 700,
      fontSize: tamano,
      color: colores.granate,
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
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 100 }}>
      <Manuscrita
        style={{
          opacity: a.opacidad,
          transform: `translateY(${(1 - a.entrada) * 40}px) rotate(-4deg)`,
          marginBottom: 24,
        }}
      >
        {antes}
      </Manuscrita>
      <TituloGrande
        tamano={165}
        style={{
          opacity: b.opacidad,
          transform: `scale(${0.6 + b.entrada * 0.4})`,
        }}
      >
        {titulo}
      </TituloGrande>
      <div
        style={{
          marginTop: 28,
          opacity: c.opacidad,
          transform: `scale(${c.entrada}) rotate(-3deg)`,
        }}
      >
        <Pastilla fondo={colores.amarillo} color={colores.granate} tamano={58}>
          {pastilla}
        </Pastilla>
      </div>
    </AbsoluteFill>
  );
};

export const TarjetaIntro: React.FC<{
  manuscrita: string;
  titulo: string;
  pastilla: string;
}> = ({ manuscrita, titulo, pastilla }) => {
  const a = useEntradaSalida(3);
  const b = useEntradaSalida(12);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
      <Manuscrita tamano={64} style={{ opacity: a.opacidad }}>
        {manuscrita}
      </Manuscrita>
      <TituloGrande
        tamano={140}
        style={{
          opacity: a.opacidad,
          transform: `scale(${0.7 + a.entrada * 0.3})`,
        }}
      >
        {titulo}
      </TituloGrande>
      <div
        style={{
          marginTop: 6,
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

export const Polaroid: React.FC<{ texto: string }> = ({ texto }) => {
  const { entrada } = useEntradaSalida(0);
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 110,
        width: 210,
        padding: "14px 14px 0",
        background: colores.blanco,
        boxShadow: sombraSuave,
        transform: `rotate(${-8 + (1 - entrada) * -20}deg) scale(${entrada})`,
      }}
    >
      <Img
        src={staticFile("portada.jpg")}
        style={{ width: "100%", height: 230, objectFit: "cover" }}
      />
      <Manuscrita
        tamano={40}
        style={{ textAlign: "center", padding: "4px 0 6px" }}
      >
        {texto}
      </Manuscrita>
    </div>
  );
};

const fondoPorColor = {
  rosa: colores.rosa,
  amarillo: colores.amarillo,
  blanco: colores.blanco,
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
          color={colores.granate}
          tamano={62}
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
        width: 560,
        padding: "34px 40px",
        background: colores.beige,
        borderRadius: 36,
        border: `5px solid ${colores.blanco}`,
        boxShadow: sombraSuave,
        opacity: opacidad,
        transform: `translateX(${(1 - entrada) * 300}px) rotate(2deg)`,
      }}
    >
      <Manuscrita tamano={58}>{titulo}</Manuscrita>
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
              fontFamily: fuentes.texto,
              fontWeight: 800,
              fontSize: 46,
              color: colores.granate,
            }}
          >
            <span
              style={{
                width: 62,
                height: 62,
                borderRadius: 999,
                background: colores.rosa,
                color: colores.blanco,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            {p.texto}
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
          width: 900,
          textAlign: "center",
          padding: "30px 40px",
          background: colores.blanco,
          borderRadius: 40,
          boxShadow: sombraSuave,
          opacity: opacidad,
          transform: `scale(${0.7 + entrada * 0.3})`,
        }}
      >
        <TituloGrande tamano={84} style={{ textShadow: "none" }}>
          {texto}
        </TituloGrande>
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
        padding: "26px 0",
        textAlign: "center",
        background: fondo,
        borderRadius: 32,
        border: `5px solid ${colores.blanco}`,
        boxShadow: sombraSuave,
        transform: `scale(${s}) rotate(${giro}deg)`,
        opacity: Math.min(1, s * 1.5),
      }}
    >
      <TituloGrande tamano={92} style={{ textShadow: "none" }}>
        {titulo}
      </TituloGrande>
    </div>
  );
  return (
    <AbsoluteFill
      style={{ paddingTop: 180, alignItems: "center", opacity: opacidad }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {tarjeta("LOW COST", colores.amarillo, entrada, -3)}
        <Manuscrita tamano={70} style={{ opacity: alto }}>
          vs
        </Manuscrita>
        {tarjeta("HIGH COST", colores.rosa, alto, 3)}
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
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
      <div
        style={{
          textAlign: "center",
          padding: "30px 60px 40px",
          background: colores.rosaClaro,
          borderRadius: 44,
          border: `6px solid ${colores.blanco}`,
          boxShadow: sombraSuave,
          transform: `translateY(${(1 - entrada) * -200}px)`,
        }}
      >
        <Manuscrita tamano={66}>{titulo}</Manuscrita>
        <TituloGrande tamano={120}>{destacado}</TituloGrande>
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
        background: "rgba(255,255,255,0.5)",
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
