import { Composition } from "remotion";
import { BodaParis } from "./BodaParis";
import { episodio1, Guion } from "./guion";
import { episodio2 } from "./guion-ep2";

const episodios: [string, Guion][] = [
  ["Episodio1", episodio1],
  ["Episodio2", episodio2],
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {episodios.map(([id, guion]) => (
        <Composition
          key={id}
          id={id}
          component={BodaParis}
          durationInFrames={Math.floor(guion.duracionSeg * 30)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ guion }}
        />
      ))}
    </>
  );
};
