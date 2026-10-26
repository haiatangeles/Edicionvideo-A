import { Composition } from "remotion";
import { Borrador, borradorPorDefecto } from "./Borrador";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Vertical"
      component={Borrador}
      durationInFrames={17 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={borradorPorDefecto}
    />
  );
};
