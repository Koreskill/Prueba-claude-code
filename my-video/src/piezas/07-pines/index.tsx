import { CalculateMetadataFunction, Composition } from "remotion";
import { FORMATOS, FPS, Formato } from "../../sistema/tokens";
import { esquemaPines, PropsPines, propsEjemplo } from "./esquema";
import { Pines } from "./Pines";

// Los ajustes de exportación (ProRes 4444 / VP9 con alfa) viven en scripts/render.sh.
const calcularMetadata: CalculateMetadataFunction<PropsPines> = ({
  props,
}) => ({
  ...FORMATOS[props.formato],
  durationInFrames: Math.round(props.duracion * FPS),
});

const FORMATOS_PIEZA: Formato[] = ["9x16", "16x9", "4x5"];

export const PiezaPines: React.FC = () => (
  <>
    {FORMATOS_PIEZA.map((formato) => (
      <Composition
        key={formato}
        id={`07-pines-${formato}`}
        component={Pines}
        schema={esquemaPines}
        defaultProps={propsEjemplo(formato)}
        calculateMetadata={calcularMetadata}
        fps={FPS}
        durationInFrames={90}
        {...FORMATOS[formato]}
      />
    ))}
  </>
);
