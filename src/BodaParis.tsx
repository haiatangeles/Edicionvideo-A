import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
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
  pregunta,
  titulos,
  viajes,
  VIDEO,
  vogue,
} from "./guion";
import {
  BarraProgreso,
  Cierre,
  Comparativa,
  FondoPuntos,
  Gancho,
  Lista,
  Pregunta,
  TarjetaIntro,
  TituloDidactico,
  TituloVogue,
  Viajes,
} from "./Piezas";

export const BodaParis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (seg: number) => Math.round(seg * fps);

  // Durante la intro el vídeo se encoge dentro de una tarjeta, como en la referencia
  const tarjeta = interpolate(
    frame,
    [f(intro.desde), f(intro.desde) + 10, f(intro.hasta) - 10, f(intro.hasta)],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const escalaVideo = interpolate(tarjeta, [0, 1], [1, 0.66]);

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
            tarjeta > 0 ? "0 30px 60px rgba(122,31,61,0.25)" : undefined,
        }}
      >
        {/* Vídeo original, sin filtros ni zoom */}
        <OffthreadVideo
          src={staticFile(VIDEO)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
        name="Vogue"
        from={f(vogue.desde)}
        durationInFrames={f(vogue.hasta - vogue.desde)}
      >
        <TituloVogue antes={vogue.antes} titulo={vogue.titulo} />
      </Sequence>
      <Sequence
        name="Viajes"
        from={f(viajes.desde)}
        durationInFrames={f(viajes.hasta - viajes.desde)}
      >
        <Viajes antes={viajes.antes} titulo={viajes.titulo} />
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
        <Cierre
          titulo={cierre.titulo}
          destacado={cierre.destacado}
          boton={cierre.boton}
          botonPulsado={cierre.botonPulsado}
        />
      </Sequence>
      <BarraProgreso />
    </AbsoluteFill>
  );
};
