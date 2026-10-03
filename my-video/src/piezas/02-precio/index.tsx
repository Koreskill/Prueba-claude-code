import { CalculateMetadataFunction, Composition } from "remotion";
import { FORMATOS, FPS, Formato } from "../../sistema/tokens";
import { esquemaPrecio, PropsPrecio, propsEjemplo } from "./esquema";
import { RevelaPrecio } from "./RevelaPrecio";

// Los ajustes de exportación (ProRes 4444 / VP9 con alfa) viven en scripts/render.sh.
const calcularMetadata: CalculateMetadataFunction<PropsPrecio> = ({
  props,
}) => ({
  ...FORMATOS[props.formato],
  durationInFrames: Math.round(props.duracion * FPS),
});

const FORMATOS_PIEZA: Formato[] = ["9x16", "16x9", "4x5"];

export const PiezaPrecio: React.FC = () => (
  <>
    {FORMATOS_PIEZA.map((formato) => (
      <Composition
        key={formato}
        id={`02-precio-${formato}`}
        component={RevelaPrecio}
        schema={esquemaPrecio}
        defaultProps={{ ...propsEjemplo, formato }}
        calculateMetadata={calcularMetadata}
        fps={FPS}
        durationInFrames={105}
        {...FORMATOS[formato]}
      />
    ))}
  </>
);
