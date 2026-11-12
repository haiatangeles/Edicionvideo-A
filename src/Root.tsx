import { Composition } from "remotion";
import { EpisodioCompleto } from "./BodaParis";
import { duracionTotal, episodio1, Guion } from "./guion";
import { episodio2, episodio2Corto, episodio2Reel } from "./guion-ep2";
import { episodio3 } from "./guion-ep3";

const episodios: [string, Guion][] = [
  ["Episodio1", episodio1],
  ["Episodio2", episodio2],
  ["Episodio2Corto", episodio2Corto],
  ["Episodio2Reel", episodio2Reel],
  ["Episodio3", episodio3],
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {episodios.map(([id, guion]) => (
        <Composition
          key={id}
          id={id}
          component={EpisodioCompleto}
          durationInFrames={Math.floor(duracionTotal(guion) * 30)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ guion }}
        />
      ))}
    </>
  );
};
