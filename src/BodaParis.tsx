import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colores } from "./estilo";
import { Guion, tiempoSalida } from "./guion";
import {
  BarraProgreso,
  Cierre,
  Comparativa,
  Contador,
  FondoIntro,
  Gancho,
  GanchoPrevio,
  Lista,
  Pregunta,
  TarjetaIntro,
  TituloDidactico,
  Viajes,
} from "./Piezas";

export const BodaParis: React.FC<{ guion: Guion }> = ({ guion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (seg: number) => Math.round(seg * fps);
  // Tiempos del guion (vídeo original) -> frames del vídeo editado
  const fs = (seg: number) => f(tiempoSalida(guion, seg));
  // Un elemento que tras los cortes dura menos de 1,2 s no se muestra
  const cabe = (desde: number, hasta: number) =>
    fs(hasta) - fs(desde) >= f(1.2);
  const tramos = guion.cortes ?? [[0, guion.duracionSeg]];
  const {
    gancho,
    intro,
    viajes,
    titulos,
    contador,
    lista,
    pregunta,
    comparativa,
    cierre,
  } = guion;

  // Durante la intro el vídeo se encoge dentro de una tarjeta, como en la referencia
  const tarjeta = interpolate(
    frame,
    [
      fs(intro.desde),
      fs(intro.desde) + 10,
      fs(intro.hasta) - 10,
      fs(intro.hasta),
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const escalaVideo = interpolate(tarjeta, [0, 1], [1, 0.66]);

  return (
    <AbsoluteFill style={{ backgroundColor: colores.crema }}>
      <FondoIntro style={{ opacity: tarjeta }} />
      <AbsoluteFill
        style={{
          transform: `translateY(${tarjeta * 190}px) scale(${escalaVideo})`,
          transformOrigin: "50% 38%",
          border:
            tarjeta > 0
              ? `${tarjeta * 12}px solid ${colores.crema}`
              : undefined,
          borderRadius: tarjeta * 12,
          overflow: "hidden",
          boxShadow:
            tarjeta > 0 ? "0 24px 50px rgba(42,36,32,0.18)" : undefined,
        }}
      >
        {/* Vídeo original, sin filtros ni zoom; cada tramo que se queda va seguido del anterior */}
        {tramos.map(([a, b], i) => (
          <Sequence
            key={a}
            name={`Tramo ${i + 1}`}
            from={fs(a)}
            durationInFrames={f(b - a)}
          >
            <OffthreadVideo
              src={staticFile(guion.video)}
              trimBefore={f(a)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Sequence>
        ))}
      </AbsoluteFill>

      <Sequence name="Gancho" durationInFrames={fs(gancho.hasta)}>
        <Gancho
          antes={gancho.antes}
          titulo={gancho.titulo}
          pastilla={gancho.pastilla}
        />
      </Sequence>
      <Sequence
        name="Intro"
        from={fs(intro.desde)}
        durationInFrames={fs(intro.hasta) - fs(intro.desde)}
      >
        <TarjetaIntro
          manuscrita={intro.manuscrita}
          titulo={intro.titulo}
          pastilla={intro.pastilla}
        />
      </Sequence>
      {viajes && cabe(viajes.desde, viajes.hasta) ? (
        <Sequence
          name="Viajes"
          from={fs(viajes.desde)}
          durationInFrames={fs(viajes.hasta) - fs(viajes.desde)}
        >
          <Viajes antes={viajes.antes} titulo={viajes.titulo} />
        </Sequence>
      ) : null}
      {titulos
        .filter((t) => cabe(t.desde, t.hasta))
        .map((t) => (
          <Sequence
            key={t.texto}
            name={t.texto}
            from={fs(t.desde)}
            durationInFrames={fs(t.hasta) - fs(t.desde)}
          >
            <TituloDidactico texto={t.texto} sticker={t.sticker} />
          </Sequence>
        ))}
      {contador && cabe(contador.desde, contador.hasta) ? (
        <Sequence
          name="Contador"
          from={fs(contador.desde)}
          durationInFrames={fs(contador.hasta) - fs(contador.desde)}
        >
          <Contador
            antes={contador.antes}
            cantidad={contador.cantidad}
            enFrames={fs(contador.en) - fs(contador.desde)}
            despues={contador.despues}
          />
        </Sequence>
      ) : null}
      {lista && cabe(lista.desde, lista.hasta) ? (
        <Sequence
          name="Lista"
          from={fs(lista.desde)}
          durationInFrames={fs(lista.hasta) - fs(lista.desde)}
        >
          <Lista
            titulo={lista.titulo}
            puntos={lista.puntos.map((p) => ({
              texto: p.texto,
              enFrames: fs(p.en) - fs(lista.desde),
            }))}
          />
        </Sequence>
      ) : null}
      {pregunta && cabe(pregunta.desde, pregunta.hasta) ? (
        <Sequence
          name="Pregunta"
          from={fs(pregunta.desde)}
          durationInFrames={fs(pregunta.hasta) - fs(pregunta.desde)}
        >
          <Pregunta texto={pregunta.texto} />
        </Sequence>
      ) : null}
      {comparativa && cabe(comparativa.desde, comparativa.hasta) ? (
        <Sequence
          name="Low vs High"
          from={fs(comparativa.desde)}
          durationInFrames={fs(comparativa.hasta) - fs(comparativa.desde)}
        >
          <Comparativa
            altoEnFrames={fs(comparativa.high) - fs(comparativa.desde)}
          />
        </Sequence>
      ) : null}
      <Sequence name="Cierre" from={fs(cierre.desde)}>
        <Cierre
          titulo={cierre.titulo}
          destacado={cierre.destacado}
          boton={cierre.boton}
          botonPulsado={cierre.botonPulsado}
        />
      </Sequence>
      <BarraProgreso />
      {(guion.sonidos ?? []).map((s, i) => (
        <Sequence
          key={i}
          name={`Sonido ${s.archivo}`}
          from={fs(s.en)}
          durationInFrames={f(3)}
          layout="none"
        >
          <Html5Audio
            src={staticFile(`sfx/${s.archivo}.wav`)}
            volume={s.volumen}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Episodio con el gancho visual delante (si lo tiene) y después el vídeo principal
export const EpisodioCompleto: React.FC<{ guion: Guion }> = ({ guion }) => {
  const { fps } = useVideoConfig();
  const { previo } = guion;
  if (!previo) {
    return <BodaParis guion={guion} />;
  }
  const n = Math.round(previo.duracionSeg * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: colores.crema }}>
      <Sequence name="Gancho previo" durationInFrames={n}>
        <GanchoPrevio previo={previo} />
        <Html5Audio src={staticFile("sfx/brillos.wav")} volume={0.3} />
      </Sequence>
      <Sequence
        name="Transición"
        from={n - 6}
        durationInFrames={Math.round(fps)}
      >
        <Html5Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
      </Sequence>
      <Sequence name="Episodio" from={n}>
        <BodaParis guion={guion} />
      </Sequence>
    </AbsoluteFill>
  );
};
