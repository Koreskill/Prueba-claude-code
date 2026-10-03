import { Composition } from "remotion";
import { metadataReel, REEL } from "../../sistema/reel";
import { FPS } from "../../sistema/tokens";
import { esquemaSol, PropsSol, propsEjemplo } from "./esquema";
import { Sol } from "./Sol";

export const PiezaSol: React.FC = () => (
  <Composition
    id="13-sol-9x16"
    component={Sol}
    schema={esquemaSol}
    defaultProps={propsEjemplo}
    calculateMetadata={metadataReel<PropsSol>()}
    fps={FPS}
    durationInFrames={150}
    {...REEL}
  />
);
