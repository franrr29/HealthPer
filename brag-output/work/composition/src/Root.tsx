import { Composition } from "remotion";
import { BragVideo } from "./Video";

const FPS = 30;
const DURATION_IN_FRAMES = 750; // 25s

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Brag"
      component={BragVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
