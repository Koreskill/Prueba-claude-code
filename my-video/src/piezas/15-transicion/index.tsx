import { Composition } from "remotion";
import { REEL } from "../../sistema/reel";
import { FPS } from "../../sistema/tokens";
import { esquemaTransicion, propsEjemplo } from "./esquema";
import { Transicion } from "./Transicion";

export const PiezaTransicion: React.FC = () => (
  <Composition
    id="15-transicion-9x16"
    component={Transicion}
    schema={esquemaTransicion}
    defaultProps={propsEjemplo}
    fps={FPS}
    durationInFrames={24}
    {...REEL}
  />
);
