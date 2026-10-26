import React from "react";
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
import { colores } from "./estilo";
import {
  cierre,
  comparativa,
  gancho,
  intro,
  lista,
  polaroid,
  pregunta,
  titulos,
  VIDEO,
  zooms,
} from "./guion";
import {
  BarraProgreso,
  Cierre,
  Comparativa,
  FondoPuntos,
  Gancho,
  Lista,
  Polaroid,
  Pregunta,
  TarjetaIntro,
  TituloDidactico,
} from "./Piezas";

// Escala del vídeo según los zooms del guion, con transición suave entre uno y otro
const useZoom = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let i = 0;
  while (i + 1 < zooms.length && zooms[i + 1].en <= t) i++;
  const anterior = i > 0 ? zooms[i - 1].escala : zooms[0].escala;
  const p = spring({
    frame: frame - zooms[i].en * fps,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });
  return interpolate(p, [0, 1], [anterior, zooms[i].escala]);
};

export const BodaParis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (seg: number) => Math.round(seg * fps);
  const zoom = useZoom();

  // Durante la intro el vídeo se encoge dentro de una tarjeta, como en la referencia
  const tarjeta = interpolate(
    frame,
    [f(intro.desde), f(intro.desde) + 10, f(intro.hasta) - 10, f(intro.hasta)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const escalaVideo = interpolate(tarjeta, [0, 1], [zoom, 0.66]);

  return (
    <AbsoluteFill style={{ backgroundColor: colores.rosaClaro }}>
      <FondoPuntos style={{ opacity: tarjeta }} />
      <AbsoluteFill
        style={{
          transform: `translateY(${tarjeta * 190}px) scale(${escalaVideo}) rotate(${tarjeta * -2}deg)`,
          transformOrigin: "50% 38%",
          border:
            tarjeta > 0
              ? `${tarjeta * 22}px solid ${colores.blanco}`
              : undefined,
          borderRadius: tarjeta * 40,
          overflow: "hidden",
          boxShadow:
            tarjeta > 0 ? "0 30px 60px rgba(122,31,61,0.3)" : undefined,
        }}
      >
        {/* Colorimetría: un poco más cálida, piel rosada y blancos cremosos */}
        <OffthreadVideo
          src={staticFile(VIDEO)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter:
              "saturate(1.08) contrast(1.04) brightness(1.03) sepia(0.08)",
          }}
        />
        <AbsoluteFill
          style={{
            background: colores.rosa,
            mixBlendMode: "soft-light",
            opacity: 0.35,
          }}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${colores.amarillo}33 0%, transparent 40%, ${colores.rosa}22 100%)`,
          }}
        />
      </AbsoluteFill>

      <Sequence name="Gancho" durationInFrames={f(gancho.hasta)}>
        <Gancho
          antes={gancho.antes}
          titulo={gancho.titulo}
          pastilla={gancho.pastilla}
        />
      </Sequence>
      <Sequence
        name="Intro"
        from={f(intro.desde)}
        durationInFrames={f(intro.hasta - intro.desde)}
      >
        <TarjetaIntro
          manuscrita={intro.manuscrita}
          titulo={intro.titulo}
          pastilla={intro.pastilla}
        />
      </Sequence>
      <Sequence
        name="Polaroid"
        from={f(polaroid.desde)}
        durationInFrames={f(pregunta.desde - polaroid.desde)}
      >
        <Polaroid texto={polaroid.texto} />
      </Sequence>
      {titulos.map((t) => (
        <Sequence
          key={t.texto}
          name={t.texto}
          from={f(t.desde)}
          durationInFrames={f(t.hasta - t.desde)}
        >
          <TituloDidactico texto={t.texto} color={t.color} />
        </Sequence>
      ))}
      <Sequence
        name="Lista"
        from={f(lista.desde)}
        durationInFrames={f(lista.hasta - lista.desde)}
      >
        <Lista
          titulo={lista.titulo}
          puntos={lista.puntos.map((p) => ({
            texto: p.texto,
            enFrames: f(p.en - lista.desde),
          }))}
        />
      </Sequence>
      <Sequence
        name="Pregunta"
        from={f(pregunta.desde)}
        durationInFrames={f(pregunta.hasta - pregunta.desde)}
      >
        <Pregunta texto={pregunta.texto} />
      </Sequence>
      <Sequence
        name="Low vs High"
        from={f(comparativa.desde)}
        durationInFrames={f(comparativa.hasta - comparativa.desde)}
      >
        <Comparativa altoEnFrames={f(comparativa.high - comparativa.desde)} />
      </Sequence>
      <Sequence name="Cierre" from={f(cierre.desde)}>
        <Cierre titulo={cierre.titulo} destacado={cierre.destacado} />
      </Sequence>
      <BarraProgreso />
    </AbsoluteFill>
  );
};
