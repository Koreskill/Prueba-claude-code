import { CalculateMetadataFunction, Composition } from "remotion";
import { FORMATOS, FPS, Formato } from "../../sistema/tokens";
import { esquemaLowerThird, PropsLowerThird, propsEjemplo } from "./esquema";
import { LowerThird } from "./LowerThird";

// Los ajustes de exportación (ProRes 4444 / VP9 con alfa) viven en scripts/render.sh.
const calcularMetadata: CalculateMetadataFunction<PropsLowerThird> = ({
  props,
}) => ({
  ...FORMATOS[props.formato],
  durationInFrames: Math.round(props.duracion * FPS),
});

const FORMATOS_PIEZA: Formato[] = ["9x16", "16x9", "4x5"];

export const PiezaLowerThird: React.FC = () => (
  <>
    {FORMATOS_PIEZA.map((formato) => (
      <Composition
        key={formato}
        id={`01-lowerthird-${formato}`}
        component={LowerThird}
        schema={esquemaLowerThird}
        defaultProps={{ ...propsEjemplo, formato }}
        calculateMetadata={calcularMetadata}
        fps={FPS}
        durationInFrames={120}
        {...FORMATOS[formato]}
      />
    ))}
  </>
);
