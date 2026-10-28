import { Composition } from "remotion";
import { BodaParis } from "./BodaParis";
import { duracionSalida, episodio1, Guion } from "./guion";
import { episodio2, episodio2Corto } from "./guion-ep2";

const episodios: [string, Guion][] = [
  ["Episodio1", episodio1],
  ["Episodio2", episodio2],
  ["Episodio2Corto", episodio2Corto],
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {episodios.map(([id, guion]) => (
        <Composition
          key={id}
          id={id}
          component={BodaParis}
          durationInFrames={Math.floor(duracionSalida(guion) * 30)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ guion }}
        />
      ))}
    </>
  );
};
