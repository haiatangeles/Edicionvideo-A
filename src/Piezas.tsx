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
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
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
}> = ({ x, derecha, y, tamano = 44, color = colores.oro, desfase = 0 }) => {
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

// Sticker de boda (public/stickers) que aparece girando y luego se mece un poco
export const Sticker: React.FC<{
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
      src={staticFile(`stickers/${nombre}.png`)}
      style={{
        position: "absolute",
        left: x,
        right: derecha,
        top: y,
        width: ancho,
        opacity: Math.min(1, entrada * 1.5) * salida,
        transform: `scale(${entrada}) rotate(${giro + (1 - entrada) * -40 + mecer}deg)`,
        filter: "drop-shadow(0 8px 14px rgba(120, 90, 70, 0.3))",
        pointerEvents: "none",
      }}
    />
  );
};

// Banner vintage: el marco dorado con rosas, siempre con su proporción original
const PROPORCION_MARCO = 413 / 1076;

export const BannerVintage: React.FC<{
  children: React.ReactNode;
  ancho: number;
  style?: React.CSSProperties;
}> = ({ children, ancho, style }) => (
  <div
    style={{
      position: "relative",
      width: ancho,
      height: ancho * PROPORCION_MARCO,
      padding: `0 ${ancho * 0.12}px`,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      filter: "drop-shadow(0 10px 18px rgba(120, 90, 70, 0.3))",
      ...style,
    }}
  >
    <Img
      src={staticFile("vintage/marco.png")}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  </div>
);

// Texto en serif vintage; el tamaño se ajusta para que quepa en el ancho dado
export const TextoVintage: React.FC<{
  children: string;
  tamano: number;
  anchoMax?: number;
  cursiva?: boolean;
  mayusculas?: boolean;
  color?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  tamano,
  anchoMax,
  cursiva = true,
  mayusculas = false,
  color = colores.oroRosa,
  style,
}) => {
  const porLetra = mayusculas ? 0.68 : 0.46;
  const ajustado = anchoMax
    ? Math.min(tamano, anchoMax / (children.length * porLetra))
    : tamano;
  return (
    <div
      style={{
        fontFamily: fuentes.titulo,
        fontWeight: 700,
        fontStyle: cursiva ? "italic" : "normal",
        fontSize: ajustado,
        lineHeight: 1.05,
        letterSpacing: mayusculas ? 3 : 0.5,
        textTransform: mayusculas ? "uppercase" : "none",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Manuscrita: React.FC<{
  children: React.ReactNode;
  tamano?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, tamano = 70, color = colores.oroRosa, style }) => (
  <div
    style={{
      fontFamily: fuentes.manuscrita,
      fontSize: tamano,
      lineHeight: 1.2,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

// Filete dorado que se dibuja de izquierda a derecha
const Subrayado: React.FC<{ progreso: number; ancho: number }> = ({
  progreso,
  ancho,
}) => {
  const largo = ancho * 1.05;
  return (
    <svg
      width={ancho}
      height={34}
      style={{ display: "block", margin: "0 auto" }}
    >
      <path
        d={`M10 20 Q ${ancho / 2} 6 ${ancho - 10} 18`}
        fill="none"
        stroke={colores.oro}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={largo}
        strokeDashoffset={largo * (1 - progreso)}
      />
    </svg>
  );
};

export const FondoScrapbook: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <Img
    src={staticFile("vintage/scrapbook.jpg")}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      ...style,
    }}
  />
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
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
      <Manuscrita
        tamano={84}
        style={{
          textShadow: halo,
          opacity: a.opacidad,
          transform: `translateY(${(1 - a.entrada) * 40}px) rotate(-4deg)`,
        }}
      >
        {antes}
      </Manuscrita>
      <TextoVintage
        tamano={132}
        cursiva={false}
        mayusculas
        style={{
          textShadow: halo,
          opacity: b.opacidad,
          transform: `scale(${0.6 + b.entrada * 0.4})`,
        }}
      >
        {titulo}
      </TextoVintage>
      <div style={{ opacity: b.salida }}>
        <Subrayado progreso={raya} ancho={720} />
      </div>
      <div
        style={{
          marginTop: 6,
          opacity: c.opacidad,
          transform: `scale(${c.entrada}) rotate(-3deg)`,
        }}
      >
        <BannerVintage ancho={440}>
          <TextoVintage tamano={60}>{pastilla}</TextoVintage>
        </BannerVintage>
      </div>
      <Sticker
        nombre="tacones"
        ancho={180}
        derecha={30}
        y={40}
        giro={12}
        retraso={10}
      />
      <Sticker
        nombre="corazon"
        ancho={130}
        x={70}
        y={470}
        giro={-10}
        retraso={16}
      />
    </AbsoluteFill>
  );
};

// Título del episodio, encima del scrapbook de cisnes
export const TarjetaIntro: React.FC<{
  manuscrita: string;
  titulo: string;
  pastilla: string;
}> = ({ manuscrita, titulo, pastilla }) => {
  const { entrada, opacidad } = useEntradaSalida(6);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 1180 }}>
      <div
        style={{
          opacity: opacidad,
          transform: `translateY(${(1 - entrada) * 120}px) rotate(-2deg)`,
        }}
      >
        <BannerVintage ancho={820}>
          <Manuscrita tamano={52}>{manuscrita}</Manuscrita>
          <TextoVintage tamano={92} cursiva={false} mayusculas>
            {titulo}
          </TextoVintage>
          <TextoVintage tamano={36} style={{ marginTop: 6 }}>
            {pastilla}
          </TextoVintage>
        </BannerVintage>
      </div>
      <Destello x={150} y={1150} tamano={50} desfase={0} />
      <Destello
        derecha={150}
        y={1420}
        tamano={36}
        color={colores.blanco}
        desfase={12}
      />
    </AbsoluteFill>
  );
};

const Avioncito: React.FC = () => (
  <svg viewBox="0 0 100 100" width={130} height={130}>
    <path
      d="M50 5 C54 5 56 10 56 16 L56 38 L92 58 L92 66 L56 55 L56 78 L68 87 L68 93 L50 88 L32 93 L32 87 L44 78 L44 55 L8 66 L8 58 L44 38 L44 16 C44 10 46 5 50 5Z"
      fill={colores.crema}
      stroke={colores.oro}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </svg>
);

// Gancho de viajes + avión que cruza por arriba dejando una estela de puntitos
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
    y: 600 - Math.sin(q * Math.PI) * 180 - q * 60,
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
            fill={colores.crema}
            stroke={colores.oro}
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
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
        <Manuscrita
          tamano={70}
          style={{
            textShadow: halo,
            opacity: a.opacidad,
            transform: `translateY(${(1 - a.entrada) * 30}px) rotate(-3deg)`,
          }}
        >
          {antes}
        </Manuscrita>
        <div
          style={{
            position: "relative",
            opacity: b.opacidad,
            transform: `scale(${b.entrada}) rotate(-3deg) translateY(${flotar}px)`,
          }}
        >
          <BannerVintage ancho={520}>
            <TextoVintage tamano={96}>{titulo}</TextoVintage>
          </BannerVintage>
          <Sticker
            nombre="auto"
            ancho={220}
            derecha={-190}
            y={150}
            giro={-4}
            retraso={2}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TituloDidactico: React.FC<{ texto: string; sticker: string }> = ({
  texto,
  sticker,
}) => {
  const frame = useCurrentFrame();
  const { entrada, opacidad } = useEntradaSalida(0);
  const flotar = Math.sin(frame / 14) * 5;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
      <div
        style={{
          position: "relative",
          opacity: opacidad,
          transform: `translateY(${(1 - entrada) * -60 + flotar}px) rotate(-2deg)`,
        }}
      >
        <BannerVintage ancho={720}>
          <TextoVintage tamano={68} anchoMax={720 * 0.7}>
            {texto}
          </TextoVintage>
        </BannerVintage>
        <Sticker
          nombre={sticker}
          ancho={170}
          x={-110}
          y={-50}
          giro={-12}
          retraso={3}
        />
        <Destello derecha={-20} y={-20} tamano={48} />
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
        padding: "26px 40px 34px",
        background: colores.crema,
        borderRadius: 18,
        border: `3px solid ${colores.oro}`,
        outline: `2px solid ${colores.oro}`,
        outlineOffset: -14,
        boxShadow: sombraSuave,
        opacity: opacidad,
        transform: `translateX(${(1 - entrada) * 300}px) rotate(2deg)`,
      }}
    >
      <Sticker
        nombre="arco"
        ancho={150}
        derecha={-70}
        y={-90}
        giro={10}
        retraso={6}
      />
      <Manuscrita tamano={66}>{titulo}</Manuscrita>
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
              marginTop: 14,
              opacity: s,
              transform: `translateX(${(1 - s) * 60}px)`,
            }}
          >
            <span
              style={{
                width: 58,
                height: 58,
                borderRadius: 999,
                background: colores.rosa,
                border: `2px solid ${colores.oro}`,
                color: colores.blanco,
                fontFamily: fuentes.titulo,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <TextoVintage tamano={50}>{p.texto}</TextoVintage>
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
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
      <div
        style={{
          position: "relative",
          opacity: opacidad,
          transform: `scale(${0.7 + entrada * 0.3})`,
        }}
      >
        <BannerVintage ancho={920}>
          <div
            style={{
              fontFamily: fuentes.titulo,
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: 70,
              lineHeight: 1.05,
              color: colores.oroRosa,
            }}
          >
            {texto.slice(0, letras)}
            <span style={{ opacity: cursor ? 1 : 0, color: colores.oro }}>
              |
            </span>
            {/* El resto ocupa su sitio sin verse, así el texto no salta */}
            <span style={{ opacity: 0 }}>{texto.slice(letras)}</span>
          </div>
        </BannerVintage>
        <Sticker
          nombre="novia"
          ancho={130}
          x={-60}
          y={160}
          giro={-8}
          retraso={8}
        />
        <Sticker
          nombre="traje"
          ancho={130}
          derecha={-60}
          y={160}
          giro={8}
          retraso={12}
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
  const tarjeta = (titulo: string, s: number, giro: number) => (
    <div
      style={{
        transform: `scale(${s}) rotate(${giro}deg)`,
        opacity: Math.min(1, s * 1.5),
      }}
    >
      <BannerVintage ancho={430}>
        <TextoVintage tamano={64}>{titulo}</TextoVintage>
      </BannerVintage>
    </div>
  );
  return (
    <AbsoluteFill
      style={{ paddingTop: 170, alignItems: "center", opacity: opacidad }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {tarjeta("Low cost", entrada, -3)}
        <Manuscrita tamano={80} style={{ opacity: alto, textShadow: halo }}>
          vs
        </Manuscrita>
        {tarjeta("High cost", alto, 3)}
        <Sticker
          nombre="copas"
          ancho={140}
          x={380}
          y={130}
          giro={-6}
          retraso={4}
        />
      </div>
    </AbsoluteFill>
  );
};

const Dedo: React.FC = () => (
  <svg viewBox="0 0 64 64" width={76} height={76}>
    <path
      d="M24 6c3 0 5 2 5 5v17l3-1c3-1 6 1 6 4v1l3-1c3-1 6 1 6 4v1l2-1c3 0 6 2 6 5v10c0 9-7 15-16 15h-6c-5 0-9-3-11-7L9 39c-2-3 0-7 4-7 2 0 3 1 5 3l1 2V11c0-3 2-5 5-5Z"
      fill={colores.blanco}
      stroke={colores.oroRosa}
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
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
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
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 50 }}>
      <div
        style={{
          position: "relative",
          transform: `translateY(${(1 - entrada) * -200}px)`,
        }}
      >
        <BannerVintage ancho={820}>
          {/* Todo en un mismo párrafo */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              whiteSpace: "nowrap",
            }}
          >
            <Manuscrita tamano={42} style={{ marginRight: 8 }}>
              {titulo}
            </Manuscrita>
            <TextoVintage tamano={48} cursiva={false} mayusculas>
              {destacado}
            </TextoVintage>
          </div>
          <div style={{ position: "relative", marginTop: 10 }}>
            {/* Onda del toque */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                border: `4px solid ${colores.oro}`,
                transform: `scale(${1 + onda * 0.35})`,
                opacity: onda > 0 ? 1 - onda : 0,
              }}
            />
            <div
              style={{
                padding: "6px 30px 8px",
                borderRadius: 999,
                border: `2px solid ${colores.oro}`,
                background: pulsado ? colores.crema : colores.rosa,
                color: pulsado ? colores.oroRosa : colores.blanco,
                fontFamily: fuentes.titulo,
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: 34,
                transform: `scale(${presion})`,
              }}
            >
              {pulsado ? botonPulsado : boton}
            </div>
            <div
              style={{
                position: "absolute",
                left: "45%",
                top: 22,
                transform: `translate(${(1 - llegada) * 220 + salidaDedo * 160}px, ${(1 - llegada) * 200 + salidaDedo * 140}px) scale(${pulsado && frame < toque + 5 ? 0.9 : 1})`,
                opacity: 1 - salidaDedo,
              }}
            >
              <Dedo />
            </div>
          </div>
        </BannerVintage>
        <Sticker
          nombre="corazon"
          ancho={110}
          x={-40}
          y={200}
          giro={-12}
          retraso={6}
        />
        {pulsado ? (
          <>
            <Destello derecha={40} y={10} tamano={44} />
            <Destello
              x={90}
              y={240}
              tamano={30}
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
        height: 14,
        background: "rgba(255,255,255,0.5)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${(frame / (durationInFrames - 1)) * 100}%`,
          background: `linear-gradient(90deg, ${colores.rosa}, ${colores.oro})`,
        }}
      />
    </div>
  );
};
