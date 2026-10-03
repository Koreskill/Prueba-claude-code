import { Composition } from "remotion";
import { metadataReel, REEL } from "../../sistema/reel";
import { FPS } from "../../sistema/tokens";
import { AntesDespues } from "./AntesDespues";
import {
  esquemaAntesDespues,
  PropsAntesDespues,
  propsEjemplo,
} from "./esquema";

export const PiezaAntesDespues: React.FC = () => (
  <Composition
    id="12-antesdespues-9x16"
    component={AntesDespues}
    schema={esquemaAntesDespues}
    defaultProps={propsEjemplo}
    calculateMetadata={metadataReel<PropsAntesDespues>()}
    fps={FPS}
    durationInFrames={180}
    {...REEL}
  />
);
