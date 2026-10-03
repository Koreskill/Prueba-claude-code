import { CalculateMetadataFunction, Composition } from "remotion";
import { FORMATOS, FPS, Formato } from "../../sistema/tokens";
import { esquemaPlano, PropsPlano, propsEjemplo } from "./esquema";
import { PlanoDibujado } from "./PlanoDibujado";

// Los ajustes de exportación (ProRes 4444 / VP9 con alfa) viven en scripts/render.sh.
const calcularMetadata: CalculateMetadataFunction<PropsPlano> = ({
  props,
}) => ({
  ...FORMATOS[props.formato],
  durationInFrames: Math.round(props.duracion * FPS),
});

const FORMATOS_PIEZA: Formato[] = ["9x16", "16x9", "4x5"];

export const PiezaPlano: React.FC = () => (
  <>
    {FORMATOS_PIEZA.map((formato) => (
      <Composition
        key={formato}
        id={`04-plano-${formato}`}
        component={PlanoDibujado}
        schema={esquemaPlano}
        defaultProps={{ ...propsEjemplo, formato }}
        calculateMetadata={calcularMetadata}
        fps={FPS}
        durationInFrames={180}
        {...FORMATOS[formato]}
      />
    ))}
  </>
);
