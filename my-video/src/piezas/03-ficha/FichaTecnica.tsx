import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FondoPreview } from "../../sistema/FondoPreview";
import { FUENTE, NUMEROS_TABULARES } from "../../sistema/fuentes";
import { Icono, NombreIcono } from "../../sistema/Iconos";
import {
  formatearNumero,
  leerNumero,
  mezcla,
  tramo,
  ventanaSalida,
} from "../../sistema/movimiento";
import {
  COLOR,
  CURVA,
  estiloPanel,
  INTERLINEADO_TITULO,
} from "../../sistema/tokens";
import { PropsFicha } from "./esquema";

type Dato = { icono: NombreIcono; valor: string; unidad: [string, string] };

const STAGGER = 0.08;
const SALIDA_CHIP = 0.25;
const SALIDA_STAGGER = 0.05;

// Grilla 2×2 (9:16 y 4:5) o fila horizontal (16:9).
const MEDIDAS = {
  grilla: {
    ancho: 440,
    alto: 150,
    radio: 28,
    icono: 56,
    numero: 64,
    unidad: 28,
    padding: 32,
    gapIcono: 24,
    columnas: 2,
  },
  fila: {
    ancho: 230,
    alto: 120,
    radio: 28,
    icono: 44,
    numero: 52,
    unidad: 28,
    padding: 18,
    gapIcono: 12,
    columnas: 4,
  },
} as const;

const GAP = 24;

export const FichaTecnica: React.FC<PropsFicha> = ({
  DORMITORIOS,
  BANOS,
  M2,
  COCHERAS,
  formato,
  fondoPreview,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / fps;

  const datos = (
    [
      {
        icono: "cama",
        valor: DORMITORIOS,
        unidad: ["dormitorio", "dormitorios"],
      },
      { icono: "banera", valor: BANOS, unidad: ["baño", "baños"] },
      { icono: "superficie", valor: M2, unidad: ["m²", "m²"] },
      { icono: "auto", valor: COCHERAS, unidad: ["cochera", "cocheras"] },
    ] satisfies Dato[]
  ).filter((d) => d.valor.trim() !== "");

  const fila = formato === "16x9";
  const m = fila ? MEDIDAS.fila : MEDIDAS.grilla;
  const columnas = Math.min(m.columnas, datos.length);
  const filas = Math.ceil(datos.length / m.columnas);
  const anchoBloque = columnas * m.ancho + (columnas - 1) * GAP;
  const altoBloque = filas * m.alto + (filas - 1) * GAP;
  // 9:16 y 4:5: bloque centrado al 62 % de la altura. 16:9: franja inferior (96 px de margen).
  const top = fila ? height - 96 - altoBloque : height * 0.62 - altoBloque / 2;

  const salida = ventanaSalida(durationInFrames, fps, SALIDA_CHIP);
  const inicioSalida = salida.inicio - SALIDA_STAGGER * (datos.length - 1);

  return (
    <AbsoluteFill>
      <FondoPreview tipo={fondoPreview} />
      <div
        style={{
          position: "absolute",
          left: (width - anchoBloque) / 2,
          top,
          width: anchoBloque,
          display: "grid",
          gridTemplateColumns: `repeat(${columnas}, ${m.ancho}px)`,
          gap: GAP,
        }}
      >
        {datos.map((dato, i) => {
          const p = tramo(t, i * STAGGER, 0.45, CURVA.entrada);
          const q = tramo(
            t,
            inicioSalida + i * SALIDA_STAGGER,
            salida.duracion,
            CURVA.salida,
          );
          const pIcono = tramo(t, 0.4 + i * STAGGER, 0.5, CURVA.suave);
          const pNumero = tramo(t, 0.4 + i * STAGGER, 0.6, CURVA.suave);

          const { valor, decimales } = leerNumero(dato.valor);
          const numero = formatearNumero(valor * pNumero, decimales);
          const unidad = dato.unidad[valor === 1 ? 0 : 1];

          const textoNumero = (
            <span
              style={{
                fontFamily: FUENTE.titulo,
                fontWeight: 700,
                fontSize: m.numero,
                lineHeight: INTERLINEADO_TITULO,
                color: COLOR.crema,
                ...NUMEROS_TABULARES,
              }}
            >
              {numero}
            </span>
          );
          const textoUnidad = (
            <span
              style={{
                fontFamily: FUENTE.dato,
                fontWeight: 500,
                fontSize: m.unidad,
                lineHeight: 1.2,
                color: COLOR.crema,
                opacity: 0.7,
                whiteSpace: "nowrap",
              }}
            >
              {unidad}
            </span>
          );

          return (
            <div
              key={dato.icono}
              style={{
                position: "relative",
                width: m.ancho,
                height: m.alto,
                overflow: "hidden",
                ...estiloPanel(m.radio),
                opacity: p * (1 - q),
                transform: `translateY(${mezcla(p, 40, 0) + mezcla(q, 0, 20)}px) scale(${mezcla(p, 0.92, 1) * mezcla(q, 1, 0.96)})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 3,
                  background: COLOR.dorado,
                }}
              />
              {fila ? (
                <div
                  style={{
                    padding: `${m.padding - 4}px ${m.padding}px`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: m.gapIcono,
                    }}
                  >
                    <Icono
                      nombre={dato.icono}
                      tamano={m.icono}
                      progreso={pIcono}
                    />
                    {textoNumero}
                  </div>
                  {textoUnidad}
                </div>
              ) : (
                <div
                  style={{
                    height: "100%",
                    padding: `0 ${m.padding}px`,
                    display: "flex",
                    alignItems: "center",
                    gap: m.gapIcono,
                  }}
                >
                  <Icono
                    nombre={dato.icono}
                    tamano={m.icono}
                    progreso={pIcono}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    {textoNumero}
                    {textoUnidad}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
