import { CalculateMetadataFunction, Composition } from "remotion";
import { FORMATOS, FPS, Formato } from "../../sistema/tokens";
import { EtiquetaGuia } from "./EtiquetaGuia";
import { esquemaEtiqueta, PropsEtiqueta, propsEjemplo } from "./esquema";

// Los ajustes de exportación (ProRes 4444 / VP9 con alfa) viven en scripts/render.sh.
const calcularMetadata: CalculateMetadataFunction<PropsEtiqueta> = ({
  props,
}) => ({
  ...FORMATOS[props.formato],
  durationInFrames: Math.round(props.duracion * FPS),
});

const FORMATOS_PIEZA: Formato[] = ["9x16", "16x9", "4x5"];

export const PiezaEtiqueta: React.FC = () => (
  <>
    {FORMATOS_PIEZA.map((formato) => (
      <Composition
        key={formato}
        id={`06-etiqueta-${formato}`}
        component={EtiquetaGuia}
        schema={esquemaEtiqueta}
        defaultProps={propsEjemplo(formato)}
        calculateMetadata={calcularMetadata}
        fps={FPS}
        durationInFrames={75}
        {...FORMATOS[formato]}
      />
    ))}
  </>
);
