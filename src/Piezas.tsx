import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
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

// Estrellita que parpadea suavemente
export const Destello: React.FC<{
  x?: number;
  derecha?: number;
  y: number;
  tamano?: number;
  color?: string;
  desfase?: number;
}> = ({
  x,
  derecha,
  y,
  tamano = 44,
  color = colores.amarillo,
  desfase = 0,
}) => {
  const frame = useCurrentFrame();
  const s = 0.55 + 0.45 * Math.sin((frame + desfase) / 7);
  return (
    <svg
      viewBox="-50 -50 100 100"
      style={{
        position: "absolute",
        left: x,
        right: derecha,
        top: y,
        width: tamano,
        height: tamano,
        transform: `scale(${s}) rotate(${frame * 1.5}deg)`,
        filter: `drop-shadow(0 0 6px ${colores.blanco})`,
      }}
    >
      <path
        d="M0,-50 C6,-6 6,-6 50,0 C6,6 6,6 0,50 C-6,6 -6,6 -50,0 C-6,-6 -6,-6 0,-50Z"
        fill={color}
      />
    </svg>
  );
};

// Subrayado que se dibuja de izquierda a derecha
const Subrayado: React.FC<{ progreso: number; ancho: number }> = ({
  progreso,
  ancho,
}) => {
  const largo = ancho * 1.05;
  return (
    <svg
      width={ancho}
      height={40}
      style={{ display: "block", margin: "-6px auto 0" }}
    >
      <path
        d={`M10 26 Q ${ancho / 2} 6 ${ancho - 10} 22`}
        fill="none"
        stroke={colores.rosa}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={largo}
        strokeDashoffset={largo * (1 - progreso)}
      />
    </svg>
  );
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
  const frame = useCurrentFrame();
  const raya = interpolate(frame, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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
      <div style={{ opacity: b.salida }}>
        <Subrayado progreso={raya} ancho={760} />
      </div>
      <div
        style={{
          marginTop: 10,
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

const fondoPorColor = {
  rosa: colores.rosa,
  amarillo: colores.amarillo,
  blanco: colores.blanco,
};

export const TituloDidactico: React.FC<{
  texto: string;
  color: keyof typeof fondoPorColor;
}> = ({ texto, color }) => {
  const frame = useCurrentFrame();
  const { entrada, opacidad } = useEntradaSalida(0);
  const flotar = Math.sin(frame / 14) * 5;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
      <div
        style={{
          position: "relative",
          opacity: opacidad,
          transform: `translateY(${(1 - entrada) * -60 + flotar}px) rotate(-2deg)`,
        }}
      >
        <Pastilla
          fondo={fondoPorColor[color]}
          color={colores.granate}
          tamano={62}
        >
          {texto}
        </Pastilla>
        <Destello x={-26} y={-30} tamano={52} />
        <Destello
          derecha={-14}
          y={-18}
          tamano={30}
          color={colores.rosa}
          desfase={20}
        />
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
  const frame = useCurrentFrame();
  const { entrada, opacidad } = useEntradaSalida(0);
  const letras = Math.floor(
    interpolate(frame, [6, 36], [0, texto.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const cursor = letras < texto.length || Math.floor(frame / 15) % 2 === 0;
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
          {texto.slice(0, letras)}
          {/* El resto ocupa su sitio sin verse, así la tarjeta no cambia de tamaño */}
          <span style={{ opacity: cursor ? 1 : 0, color: colores.rosa }}>
            |
          </span>
          <span style={{ opacity: 0 }}>{texto.slice(letras)}</span>
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

const Dedo: React.FC = () => (
  <svg viewBox="0 0 64 64" width={96} height={96}>
    <path
      d="M24 6c3 0 5 2 5 5v17l3-1c3-1 6 1 6 4v1l3-1c3-1 6 1 6 4v1l2-1c3 0 6 2 6 5v10c0 9-7 15-16 15h-6c-5 0-9-3-11-7L9 39c-2-3 0-7 4-7 2 0 3 1 5 3l1 2V11c0-3 2-5 5-5Z"
      fill={colores.blanco}
      stroke={colores.granate}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  </svg>
);

export const Cierre: React.FC<{
  titulo: string;
  destacado: string;
  boton: string;
  botonPulsado: string;
}> = ({ titulo, destacado, boton, botonPulsado }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { entrada } = useEntradaSalida(0);
  const toque = 32; // frame en que el dedo pulsa el botón
  const llegada = spring({ frame: frame - 12, fps, config: { damping: 16 } });
  const pulsado = frame >= toque;
  const presion = interpolate(
    frame,
    [toque - 3, toque, toque + 5],
    [1, 0.9, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const onda = interpolate(frame, [toque, toque + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const salidaDedo = interpolate(frame, [toque + 10, toque + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
      <div
        style={{
          position: "relative",
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
        <div
          style={{
            position: "relative",
            marginTop: 26,
            display: "inline-block",
          }}
        >
          {/* Onda del toque */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              border: `6px solid ${colores.amarillo}`,
              transform: `scale(${1 + onda * 0.35})`,
              opacity: onda > 0 ? 1 - onda : 0,
            }}
          />
          <Pastilla
            fondo={pulsado ? colores.amarillo : colores.granate}
            color={pulsado ? colores.granate : colores.blanco}
            tamano={50}
            style={{ transform: `scale(${presion})` }}
          >
            {pulsado ? botonPulsado : boton}
          </Pastilla>
          <div
            style={{
              position: "absolute",
              left: "58%",
              top: 34,
              transform: `translate(${(1 - llegada) * 260 + salidaDedo * 200}px, ${(1 - llegada) * 220 + salidaDedo * 160}px) scale(${pulsado && frame < toque + 5 ? 0.9 : 1})`,
              opacity: 1 - salidaDedo,
            }}
          >
            <Dedo />
          </div>
        </div>
        {pulsado ? (
          <>
            <Destello x={-20} y={-24} tamano={56} />
            <Destello
              derecha={-16}
              y={40}
              tamano={36}
              color={colores.rosa}
              desfase={15}
            />
          </>
        ) : null}
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
