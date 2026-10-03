import { CalculateMetadataFunction, Composition } from "remotion";
import { REEL } from "../../sistema/reel";
import { FPS } from "../../sistema/tokens";
import { esquemaProgreso, PropsProgreso, propsEjemplo } from "./esquema";
import { Progreso } from "./Progreso";

// Dura lo mismo que el recorrido: la suma de los tramos.
const calcularMetadata: CalculateMetadataFunction<PropsProgreso> = ({
  props,
}) => ({
  ...REEL,
  durationInFrames: Math.round(
    props.ambientes.reduce((acc, a) => acc + a.segundos, 0) * FPS,
  ),
});

export const PiezaProgreso: React.FC = () => (
  <Composition
    id="10-progreso-9x16"
    component={Progreso}
    schema={esquemaProgreso}
    defaultProps={propsEjemplo}
    calculateMetadata={calcularMetadata}
    fps={FPS}
    durationInFrames={900}
    {...REEL}
  />
);
