import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FUENTE } from "../../sistema/fuentes";
import { mezcla, tramo, ventanaSalida } from "../../sistema/movimiento";
import { COLOR, CURVA, SOMBRA_TEXTO } from "../../sistema/tokens";
import { PropsProgreso } from "./esquema";

const ANCHO = 952;
const ALTO = 6;
const IZQ = 64;
const DESDE_ABAJO = 400;
const PUNTO = 20;
const PUNTO_ACTUAL = 28;
const MAX_CON_NOMBRE = 6;
const CAMBIO = 0.35;

export const Progreso: React.FC<PropsProgreso> = ({ ambientes }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, height } = useVideoConfig();
  const t = frame / fps;
  const total = ambientes.reduce((acc, a) => acc + a.segundos, 0);
  const y = height - DESDE_ABAJO - ALTO / 2;

  // Inicio de cada tramo en segundos y en px (no equidistante: según la duración real).
  const inicios = ambientes.map((_, i) =>
    ambientes.slice(0, i).reduce((acc, a) => acc + a.segundos, 0),
  );
  const actual = inicios.reduce((acc, ini, i) => (t >= ini ? i : acc), 0);
  const numerados = ambientes.length > MAX_CON_NOMBRE;

  const pRiel = tramo(t, 0, 0.5, CURVA.entrada);
  const salida = ventanaSalida(durationInFrames, fps);
  const q = tramo(t, salida.inicio, salida.duracion, CURVA.salida);
  // El relleno avanza lineal y llega al 100 % cuando empieza la salida.
  const progreso = interpolate(t, [0, salida.inicio], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sombra = "drop-shadow(0 1px 4px rgba(0, 0, 0, 0.45))";

  return (
    <AbsoluteFill style={{ opacity: 1 - q }}>
      <div
        style={{
          position: "absolute",
          left: IZQ,
          top: y,
          width: ANCHO * pRiel,
          height: ALTO,
          borderRadius: ALTO / 2,
          background: "rgba(247, 243, 236, 0.25)",
          filter: sombra,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: IZQ,
          top: y,
          width: Math.min(ANCHO * progreso, ANCHO * pRiel),
          height: ALTO,
          borderRadius: ALTO / 2,
          background: COLOR.dorado,
        }}
      />

      {ambientes.map((a, i) => {
        const x = IZQ + (inicios[i] / total) * ANCHO;
        const aparece = tramo(t, 0.3 + i * 0.04, 0.3, CURVA.rebote);
        const esActual = i === actual;
        const pasado = i < actual;
        // Pulso al llegar al ambiente: 1 → 1,3 → 1 en 300 ms.
        const pulso = interpolate(
          t,
          [inicios[i], inicios[i] + 0.15, inicios[i] + 0.3],
          [1, 1.3, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const tam = esActual || numerados ? PUNTO_ACTUAL : PUNTO;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - tam / 2,
              top: y + ALTO / 2 - tam / 2,
              width: tam,
              height: tam,
              borderRadius: "50%",
              boxSizing: "border-box",
              background:
                esActual || pasado ? COLOR.dorado : "rgba(247, 243, 236, 0.4)",
              border: esActual ? `3px solid ${COLOR.crema}` : undefined,
              transform: `scale(${aparece * (i > 0 ? pulso : 1)})`,
              filter: sombra,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FUENTE.titulo,
              fontWeight: 700,
              fontSize: 14,
              color: COLOR.navy,
            }}
          >
            {numerados ? i + 1 : null}
          </div>
        );
      })}

      {numerados
        ? null
        : ambientes.map((a, i) => {
            // El nombre entra desde abajo al empezar su tramo y sale hacia arriba al siguiente.
            const entra =
              i === 0
                ? tramo(t, 0.3, CAMBIO, CURVA.entrada)
                : tramo(t, inicios[i], CAMBIO, CURVA.entrada);
            const siguiente = inicios[i + 1];
            const sale =
              siguiente === undefined
                ? 0
                : tramo(t, siguiente, CAMBIO, CURVA.entrada);
            const visible = entra * (1 - sale);
            if (visible <= 0) return null;
            const x = IZQ + (inicios[i] / total) * ANCHO;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: y - 24 - 34,
                  // Alineado al punto, sin salirse del riel.
                  left: Math.min(Math.max(x - 14, IZQ), IZQ + ANCHO - 260),
                  fontFamily: FUENTE.dato,
                  fontWeight: 600,
                  fontSize: 28,
                  lineHeight: "34px",
                  color: COLOR.crema,
                  textShadow: SOMBRA_TEXTO,
                  whiteSpace: "nowrap",
                  opacity: visible,
                  transform: `translateY(${mezcla(entra, 16, 0) + mezcla(sale, 0, -16)}px)`,
                }}
              >
                {a.AMBIENTE}
              </div>
            );
          })}
    </AbsoluteFill>
  );
};
