import { Composition } from "remotion";
import { metadataReel, REEL } from "../../sistema/reel";
import { FPS } from "../../sistema/tokens";
import { esquemaMapa, PropsMapa, propsEjemplo } from "./esquema";
import { Mapa } from "./Mapa";

export const PiezaMapa: React.FC = () => (
  <Composition
    id="08-mapa-9x16"
    component={Mapa}
    schema={esquemaMapa}
    defaultProps={propsEjemplo}
    calculateMetadata={metadataReel<PropsMapa>()}
    fps={FPS}
    durationInFrames={180}
    {...REEL}
  />
);
