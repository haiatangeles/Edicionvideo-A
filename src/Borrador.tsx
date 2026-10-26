import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { subtitulosEjemplo } from "./subtitulos-ejemplo";
import { estilo } from "./estilo";

export type BorradorProps = {
  // Nombre del vídeo dentro de public/ (p. ej. "mi-video.mp4"). null = fondo de muestra.
  video: string | null;
  subtitulos: Caption[];
};

export const borradorPorDefecto: BorradorProps = {
  video: null,
  subtitulos: subtitulosEjemplo,
};

const contorno = `0 0 12px ${estilo.colores.contorno}, 4px 4px 0 ${estilo.colores.contorno}, -4px -4px 0 ${estilo.colores.contorno}, 4px -4px 0 ${estilo.colores.contorno}, -4px 4px 0 ${estilo.colores.contorno}`;

const Fondo: React.FC<{ video: string | null }> = ({ video }) => {
  if (video) {
    return (
      <OffthreadVideo
        src={staticFile(video)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #2b2b2b, ${estilo.colores.fondo})`,
        justifyContent: "center",
        alignItems: "center",
        color: "#666",
        fontFamily: estilo.fuente,
        fontWeight: 900,
        fontSize: 48,
      }}
    >
      [ aquí va tu vídeo ]
    </AbsoluteFill>
  );
};

const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 260,
      }}
    >
      <div
        style={{
          transform: `scale(${entrada})`,
          background: estilo.colores.destacado,
          color: estilo.colores.contorno,
          fontFamily: estilo.fuente,
          fontWeight: 900,
          fontSize: estilo.gancho.tamano,
          padding: "24px 40px",
          borderRadius: 24,
          maxWidth: 940,
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        {estilo.gancho.texto}
      </div>
    </AbsoluteFill>
  );
};

const Subtitulos: React.FC<{ subtitulos: Caption[] }> = ({ subtitulos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const { pages } = createTikTokStyleCaptions({
    captions: subtitulos,
    combineTokensWithinMilliseconds: estilo.subtitulos.agruparMs,
  });
  const pagina = pages.find(
    (p) => ms >= p.startMs && ms < p.startMs + p.durationMs,
  );
  if (!pagina) return null;

  const salto = spring({
    frame: frame - Math.round((pagina.startMs / 1000) * fps),
    fps,
    config: { damping: 14 },
    durationInFrames: 8,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: estilo.subtitulos.posicionAbajo,
      }}
    >
      <div
        style={{
          transform: `scale(${interpolate(salto, [0, 1], [0.8, 1])})`,
          fontFamily: estilo.fuente,
          fontWeight: 900,
          fontSize: estilo.subtitulos.tamano,
          textAlign: "center",
          maxWidth: 960,
          lineHeight: 1.15,
          textShadow: contorno,
          textTransform: estilo.subtitulos.mayusculas ? "uppercase" : "none",
          whiteSpace: "pre-wrap",
        }}
      >
        {pagina.tokens.map((t) => {
          const activa = ms >= t.fromMs && ms < t.toMs;
          return (
            <span
              key={t.fromMs}
              style={{
                color: activa ? estilo.colores.destacado : estilo.colores.texto,
              }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame, fps });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity: entrada,
          transform: `translateY(${interpolate(entrada, [0, 1], [80, 0])}px)`,
          fontFamily: estilo.fuente,
          fontWeight: 900,
          fontSize: 90,
          color: estilo.colores.texto,
          textShadow: contorno,
          textAlign: "center",
        }}
      >
        {estilo.cierre.texto}
      </div>
    </AbsoluteFill>
  );
};

const BarraProgreso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 14,
        width: `${(frame / (durationInFrames - 1)) * 100}%`,
        background: estilo.colores.barra,
      }}
    />
  );
};

export const Borrador: React.FC<BorradorProps> = ({ video, subtitulos }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const cierreFrames = Math.round(estilo.cierre.duracionSeg * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: estilo.colores.fondo }}>
      <Fondo video={video} />
      <Subtitulos subtitulos={subtitulos} />
      <Sequence
        name="Gancho"
        durationInFrames={Math.round(estilo.gancho.duracionSeg * fps)}
      >
        <Gancho />
      </Sequence>
      <Sequence name="Cierre" from={durationInFrames - cierreFrames}>
        <Cierre />
      </Sequence>
      {estilo.barraProgreso ? <BarraProgreso /> : null}
    </AbsoluteFill>
  );
};
