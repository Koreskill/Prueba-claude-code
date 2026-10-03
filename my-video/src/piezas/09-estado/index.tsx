import { Composition } from "remotion";
import { metadataReel, REEL } from "../../sistema/reel";
import { FPS } from "../../sistema/tokens";
import { Estado } from "./Estado";
import { esquemaEstado, PropsEstado, propsEjemplo } from "./esquema";

export const PiezaEstado: React.FC = () => (
  <Composition
    id="09-estado-9x16"
    component={Estado}
    schema={esquemaEstado}
    defaultProps={propsEjemplo}
    calculateMetadata={metadataReel<PropsEstado>()}
    fps={FPS}
    durationInFrames={120}
    {...REEL}
  />
);
