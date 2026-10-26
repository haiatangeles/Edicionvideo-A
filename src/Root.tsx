import { Composition } from "remotion";
import { BodaParis } from "./BodaParis";
import { DURACION_SEG } from "./guion";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Vertical"
      component={BodaParis}
      durationInFrames={Math.floor(DURACION_SEG * 30)}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
