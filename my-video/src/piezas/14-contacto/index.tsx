import { Composition } from "remotion";
import { metadataReel, REEL } from "../../sistema/reel";
import { FPS } from "../../sistema/tokens";
import { Contacto } from "./Contacto";
import { esquemaContacto, PropsContacto, propsEjemplo } from "./esquema";

export const PiezaContacto: React.FC = () => (
  <Composition
    id="14-contacto-9x16"
    component={Contacto}
    schema={esquemaContacto}
    defaultProps={propsEjemplo}
    calculateMetadata={metadataReel<PropsContacto>()}
    fps={FPS}
    durationInFrames={150}
    {...REEL}
  />
);
