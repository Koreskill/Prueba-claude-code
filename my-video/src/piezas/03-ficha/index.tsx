import { CalculateMetadataFunction, Composition } from "remotion";
import { FORMATOS, FPS, Formato } from "../../sistema/tokens";
import { esquemaFicha, PropsFicha, propsEjemplo } from "./esquema";
import { FichaTecnica } from "./FichaTecnica";

// Los ajustes de exportación (ProRes 4444 / VP9 con alfa) viven en scripts/render.sh.
const calcularMetadata: CalculateMetadataFunction<PropsFicha> = ({
  props,
}) => ({
  ...FORMATOS[props.formato],
  durationInFrames: Math.round(props.duracion * FPS),
});

const FORMATOS_PIEZA: Formato[] = ["9x16", "16x9", "4x5"];

export const PiezaFicha: React.FC = () => (
  <>
    {FORMATOS_PIEZA.map((formato) => (
      <Composition
        key={formato}
        id={`03-ficha-${formato}`}
        component={FichaTecnica}
        schema={esquemaFicha}
        defaultProps={{ ...propsEjemplo, formato }}
        calculateMetadata={calcularMetadata}
        fps={FPS}
        durationInFrames={120}
        {...FORMATOS[formato]}
      />
    ))}
  </>
);
