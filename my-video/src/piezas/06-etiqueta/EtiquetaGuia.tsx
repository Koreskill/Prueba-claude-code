import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EtiquetaAmbiente } from "../../sistema/EtiquetaAmbiente";
import { FondoPreview } from "../../sistema/FondoPreview";
import { tramo, trazo, ventanaSalida } from "../../sistema/movimiento";
import { COLOR, CURVA } from "../../sistema/tokens";
import { PropsEtiqueta } from "./esquema";

const LARGO_GUIA = 120;
const ANCLA = 18;
const ARO = 3;
const ALTO_PILDORA = 72;

export const EtiquetaGuia: React.FC<PropsEtiqueta> = ({
  AMBIENTE,
  M2,
  ancla,
  direccion,
  conLinea,
  fondoPreview,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const derecha = direccion.endsWith("Derecha");
  const arriba = direccion.startsWith("arriba");
  const paso = LARGO_GUIA / Math.SQRT2;
  const [ax, ay] = ancla;
  const fin: [number, number] = conLinea
    ? [ax + (derecha ? paso : -paso), ay + (arriba ? -paso : paso)]
    : [ax, ay];

  // Entrada. Sin línea, la píldora arranca de inmediato.
  const pAncla = tramo(t, 0, 0.25, CURVA.rebote);
  const pGuia = tramo(t, 0.15, 0.3, CURVA.entrada);
  const inicioPildora = conLinea ? 0.4 : 0;
  const pPildora = tramo(t, inicioPildora, 0.4, CURVA.entrada);
  const pTexto = tramo(t, inicioPildora + 0.2, 0.25, CURVA.entrada);

  // Salida: texto, píldora, guía y ancla se recogen en cadena y terminan en el último fotograma.
  const s = ventanaSalida(durationInFrames, fps);
  const qTexto = tramo(t, s.inicio, 0.15, CURVA.salida);
  const qPildora = tramo(t, s.inicio, 0.2, CURVA.salida);
  const qGuia = tramo(t, s.inicio + 0.1, 0.12, CURVA.salida);
  const qAncla = tramo(t, s.inicio + 0.15, s.duracion - 0.15, CURVA.salida);

  return (
    <AbsoluteFill>
      <FondoPreview tipo={fondoPreview} />

      {conLinea ? (
        <svg width="100%" height="100%" style={{ position: "absolute" }}>
          <line
            x1={ax}
            y1={ay}
            x2={fin[0]}
            y2={fin[1]}
            stroke={COLOR.dorado}
            strokeWidth={3}
            strokeLinecap="round"
            {...trazo(pGuia * (1 - qGuia))}
          />
          <circle
            cx={ax}
            cy={ay}
            r={ANCLA / 2 + ARO / 2}
            fill={COLOR.dorado}
            stroke={COLOR.crema}
            strokeWidth={ARO}
            transform={`translate(${ax} ${ay}) scale(${pAncla * (1 - qAncla)}) translate(${-ax} ${-ay})`}
          />
        </svg>
      ) : null}

      <div
        style={{
          position: "absolute",
          top: fin[1] - ALTO_PILDORA / 2,
          ...(derecha
            ? { left: fin[0] }
            : { right: `calc(100% - ${fin[0]}px)` }),
        }}
      >
        <EtiquetaAmbiente
          texto={AMBIENTE}
          sub={M2.trim() ? `${M2} m²` : undefined}
          expandir={pPildora * (1 - qPildora)}
          textoVisible={pTexto * (1 - qTexto)}
          origen={derecha ? "izquierda" : "derecha"}
        />
      </div>
    </AbsoluteFill>
  );
};
