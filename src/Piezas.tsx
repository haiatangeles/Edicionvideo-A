import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  staticFile,
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
}> = ({ x, derecha, y, tamano = 44, color = colores.rosa, desfase = 0 }) => {
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

// Flor recortada (public/flores) que aparece girando y luego se mece un poco
export const Flor: React.FC<{
  nombre: string;
  ancho: number;
  x?: number;
  derecha?: number;
  y: number;
  giro?: number;
  retraso?: number;
}> = ({ nombre, ancho, x, derecha, y, giro = 0, retraso = 4 }) => {
  const frame = useCurrentFrame();
  const { entrada, salida } = useEntradaSalida(retraso);
  const mecer = Math.sin((frame + ancho) / 22) * 4;
  return (
    <Img
      src={staticFile(`flores/${nombre}.png`)}
      style={{
        position: "absolute",
        left: x,
        right: derecha,
        top: y,
        width: ancho * 1.3,
        opacity: Math.min(1, entrada * 1.5) * salida,
        transform: `scale(${entrada}) rotate(${giro + (1 - entrada) * -40 + mecer}deg)`,
        filter: "drop-shadow(0 8px 14px rgba(120, 70, 80, 0.25))",
        pointerEvents: "none",
      }}
    />
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
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={largo}
        strokeDashoffset={largo * (1 - progreso)}
      />
    </svg>
  );
};

export const FondoCuadricula: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: colores.rosaClaro,
      backgroundImage: `linear-gradient(${colores.rosa}66 2px, transparent 2px), linear-gradient(90deg, ${colores.rosa}66 2px, transparent 2px)`,
      backgroundSize: "90px 90px",
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
  fondo = colores.rosa,
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
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, tamano = 150, color = colores.rosa, style }) => (
  <div
    style={{
      fontFamily: fuentes.titulo,
      fontSize: tamano,
      color,
      lineHeight: 1,
      letterSpacing: 2,
      textShadow: `4px 4px 0 ${colores.blanco}`,
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
      color: colores.rosa,
      textShadow: `0 0 12px ${colores.blanco}, 0 0 5px ${colores.blanco}, 0 0 2px ${colores.blanco}`,
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
        <Pastilla fondo={colores.rosa} color={colores.blanco} tamano={58}>
          {pastilla}
        </Pastilla>
      </div>
      <Flor
        nombre="lirio-tallo"
        ancho={160}
        derecha={-10}
        y={-20}
        giro={12}
        retraso={10}
      />
      <Flor
        nombre="azucena"
        ancho={150}
        x={70}
        y={430}
        giro={-10}
        retraso={16}
      />
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
      <Flor
        nombre="lirio-rosa"
        ancho={250}
        derecha={40}
        y={560}
        giro={14}
        retraso={8}
      />
      <Flor
        nombre="orquidea-verde"
        ancho={290}
        x={20}
        y={1450}
        giro={-12}
        retraso={12}
      />
      <Flor
        nombre="mariposa"
        ancho={140}
        x={70}
        y={540}
        giro={-8}
        retraso={16}
      />
    </AbsoluteFill>
  );
};

const Avioncito: React.FC = () => (
  <svg viewBox="0 0 100 100" width={130} height={130}>
    <path
      d="M50 5 C54 5 56 10 56 16 L56 38 L92 58 L92 66 L56 55 L56 78 L68 87 L68 93 L50 88 L32 93 L32 87 L44 78 L44 55 L8 66 L8 58 L44 38 L44 16 C44 10 46 5 50 5Z"
      fill={colores.rosaClaro}
      stroke={colores.rosa}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </svg>
);

// Título de viajes + avión que cruza por arriba dejando una estela de puntitos
export const Viajes: React.FC<{ antes: string; titulo: string }> = ({
  antes,
  titulo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useEntradaSalida(0);
  const b = useEntradaSalida(3);
  const p = interpolate(frame, [2, 2 + 1.25 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ruta = (q: number) => ({
    x: -150 + q * 1380,
    y: 560 - Math.sin(q * Math.PI) * 200 - q * 60,
  });
  const pos = ruta(p);
  const delante = ruta(Math.min(1, p + 0.01));
  const angulo =
    (Math.atan2(delante.y - pos.y, delante.x - pos.x) * 180) / Math.PI + 90;
  const puntos = new Array(44)
    .fill(0)
    .map((_, i) => i / 44)
    .filter((q) => q < p - 0.04)
    .map((q) => ruta(q));
  const flotar = Math.sin(frame / 14) * 5;
  return (
    <AbsoluteFill>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", opacity: a.salida }}
      >
        {puntos.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={7}
            fill={colores.rosaClaro}
            stroke={colores.rosa}
            strokeWidth={3}
          />
        ))}
      </svg>
      {p > 0 && p < 1 ? (
        <div
          style={{
            position: "absolute",
            left: pos.x - 65,
            top: pos.y - 65,
            transform: `rotate(${angulo}deg)`,
          }}
        >
          <Avioncito />
        </div>
      ) : null}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <Manuscrita
          tamano={62}
          style={{
            opacity: a.opacidad,
            transform: `translateY(${(1 - a.entrada) * 30}px) rotate(-3deg)`,
            background: colores.rosaClaro,
            color: colores.rosa,
            textShadow: "none",
            padding: "0 30px 6px",
            borderRadius: 999,
            boxShadow: sombraSuave,
          }}
        >
          {antes}
        </Manuscrita>
        <div
          style={{
            position: "relative",
            marginTop: 6,
            opacity: b.opacidad,
            transform: `scale(${b.entrada}) rotate(-3deg) translateY(${flotar}px)`,
          }}
        >
          <Pastilla fondo={colores.rosa} color={colores.blanco} tamano={84}>
            {titulo}
          </Pastilla>
          <Destello derecha={-20} y={-26} tamano={50} color={colores.salvia} />
          <Flor
            nombre="mariposa"
            ancho={130}
            derecha={-150}
            y={-40}
            giro={10}
            retraso={2}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const fondoPorColor = {
  rosa: { fondo: colores.rosa, texto: colores.blanco },
  salvia: { fondo: colores.salvia, texto: colores.blanco },
  claro: { fondo: colores.rosaClaro, texto: colores.rosa },
};

export const TituloDidactico: React.FC<{
  texto: string;
  color: keyof typeof fondoPorColor;
  flor: string;
}> = ({ texto, color, flor }) => {
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
          fondo={fondoPorColor[color].fondo}
          color={fondoPorColor[color].texto}
          tamano={62}
        >
          {texto}
        </Pastilla>
        <Flor
          nombre={flor}
          ancho={150}
          x={-120}
          y={-50}
          giro={-12}
          retraso={3}
        />
        <Destello derecha={-26} y={-30} tamano={52} />
        <Destello
          derecha={-6}
          y={46}
          tamano={30}
          color={colores.salvia}
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
        background: colores.blanco,
        borderRadius: 36,
        border: `5px solid ${colores.blanco}`,
        boxShadow: sombraSuave,
        opacity: opacidad,
        transform: `translateX(${(1 - entrada) * 300}px) rotate(2deg)`,
      }}
    >
      <Flor
        nombre="hibisco"
        ancho={150}
        derecha={-80}
        y={-90}
        giro={14}
        retraso={6}
      />
      <Manuscrita tamano={58} style={{ textShadow: "none" }}>
        {titulo}
      </Manuscrita>
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
              color: colores.rosa,
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
          position: "relative",
          width: 900,
          textAlign: "center",
          padding: "30px 40px",
          background: colores.rosa,
          border: `5px solid ${colores.blanco}`,
          borderRadius: 40,
          boxShadow: sombraSuave,
          opacity: opacidad,
          transform: `scale(${0.7 + entrada * 0.3})`,
        }}
      >
        <TituloGrande
          tamano={84}
          color={colores.blanco}
          style={{ textShadow: "none" }}
        >
          {texto.slice(0, letras)}
          {/* El resto ocupa su sitio sin verse, así la tarjeta no cambia de tamaño */}
          <span style={{ opacity: cursor ? 1 : 0, color: colores.rosaClaro }}>
            |
          </span>
          <span style={{ opacity: 0 }}>{texto.slice(letras)}</span>
        </TituloGrande>
        <Flor
          nombre="lirio-grande"
          ancho={230}
          derecha={-90}
          y={-110}
          giro={10}
          retraso={8}
        />
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
  const tarjeta = (
    titulo: string,
    fondo: string,
    letra: string,
    s: number,
    giro: number,
  ) => (
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
      <TituloGrande tamano={92} color={letra} style={{ textShadow: "none" }}>
        {titulo}
      </TituloGrande>
    </div>
  );
  return (
    <AbsoluteFill
      style={{ paddingTop: 180, alignItems: "center", opacity: opacidad }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Flor
          nombre="orquidea-rosa"
          ancho={170}
          x={-70}
          y={-80}
          giro={-12}
          retraso={4}
        />
        {tarjeta("LOW COST", colores.salvia, colores.blanco, entrada, -3)}
        <Manuscrita tamano={70} style={{ opacity: alto }}>
          vs
        </Manuscrita>
        {tarjeta("HIGH COST", colores.rosa, colores.blanco, alto, 3)}
      </div>
    </AbsoluteFill>
  );
};

const Dedo: React.FC = () => (
  <svg viewBox="0 0 64 64" width={76} height={76}>
    <path
      d="M24 6c3 0 5 2 5 5v17l3-1c3-1 6 1 6 4v1l3-1c3-1 6 1 6 4v1l2-1c3 0 6 2 6 5v10c0 9-7 15-16 15h-6c-5 0-9-3-11-7L9 39c-2-3 0-7 4-7 2 0 3 1 5 3l1 2V11c0-3 2-5 5-5Z"
      fill={colores.blanco}
      stroke={colores.rosa}
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
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "14px 18px 14px 34px",
          background: colores.rosaClaro,
          borderRadius: 999,
          border: `4px solid ${colores.blanco}`,
          boxShadow: sombraSuave,
          transform: `translateY(${(1 - entrada) * -160}px)`,
          whiteSpace: "nowrap",
        }}
      >
        <Manuscrita tamano={46} style={{ textShadow: "none" }}>
          {titulo}
        </Manuscrita>
        <TituloGrande tamano={56} style={{ textShadow: "none" }}>
          {destacado}
        </TituloGrande>
        <div style={{ position: "relative" }}>
          {/* Onda del toque */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              border: `5px solid ${colores.rosa}`,
              transform: `scale(${1 + onda * 0.35})`,
              opacity: onda > 0 ? 1 - onda : 0,
            }}
          />
          <Pastilla
            fondo={pulsado ? colores.blanco : colores.rosa}
            color={pulsado ? colores.rosa : colores.blanco}
            tamano={34}
            style={{ transform: `scale(${presion})`, boxShadow: "none" }}
          >
            {pulsado ? botonPulsado : boton}
          </Pastilla>
          <div
            style={{
              position: "absolute",
              left: "45%",
              top: 26,
              transform: `translate(${(1 - llegada) * 220 + salidaDedo * 160}px, ${(1 - llegada) * 200 + salidaDedo * 140}px) scale(${pulsado && frame < toque + 5 ? 0.9 : 1})`,
              opacity: 1 - salidaDedo,
            }}
          >
            <Dedo />
          </div>
        </div>
        <Flor
          nombre="lirio-tallo"
          ancho={110}
          x={-150}
          y={-60}
          giro={-14}
          retraso={6}
        />
        {pulsado ? (
          <>
            <Destello derecha={60} y={-22} tamano={44} />
            <Destello
              derecha={-12}
              y={-18}
              tamano={30}
              color={colores.salvia}
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
          background: `linear-gradient(90deg, ${colores.rosa}, ${colores.salvia})`,
        }}
      />
    </div>
  );
};
