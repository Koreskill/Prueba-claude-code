import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FondoPreview } from "../../sistema/FondoPreview";
import { FUENTE } from "../../sistema/fuentes";
import { mezcla, tramo } from "../../sistema/movimiento";
import {
  COLOR,
  CURVA,
  estiloPanel,
  Formato,
  ZONA_SEGURA,
} from "../../sistema/tokens";
import { Pin, PropsPines } from "./esquema";

const PIN = 28;
const CENTRO = 10;
const ANILLO_MAX = 96;
const CICLO = 1.2;
const DESFASE_ANILLO = 0.4;
const CICLOS = 2;
const CARD_ANCHO = 380;
const CARD_ALTO = 96;
const DISTANCIA = 60;
const RETRASO_CALLOUT = 0.12;
const STAGGER_PINES = 0.3;
const SALIDA_STAGGER = 0.05;

const posicion = (pin: Pin, t: number): [number, number] => {
  const claves = pin.seguimiento;
  if (!claves || claves.length === 0) return [pin.x, pin.y];
  const ts = claves.map((c) => c.t);
  const opciones = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  return [
    interpolate(
      t,
      ts,
      claves.map((c) => c.x),
      opciones,
    ),
    interpolate(
      t,
      ts,
      claves.map((c) => c.y),
      opciones,
    ),
  ];
};

const UnPin: React.FC<{
  pin: Pin;
  numero: number | null;
  t: number;
  inicio: number;
  salida: number;
  formato: Formato;
  ancho: number;
  alto: number;
}> = ({ pin, numero, t, inicio, salida, formato, ancho, alto }) => {
  const [x, y] = posicion(pin, t);
  // El callout sigue al pin con 120 ms de retraso para sentirse flotante.
  const [cxPin, cyPin] = posicion(pin, t - RETRASO_CALLOUT);

  // Pin: 0 → 1,15 → 1 en 350 ms.
  const pPin = tramo(t, inicio, 0.35, CURVA.entrada);
  const escalaPin = interpolate(pPin, [0, 0.6, 1], [0, 1.15, 1]);
  const pCallout = tramo(t, inicio + 0.45, 0.4, CURVA.entrada);

  const qCallout = tramo(t, salida, 0.25, CURVA.salida);
  const qPin = tramo(t, salida + 0.15, 0.2, CURVA.salida);
  const pulsoActivo = t < salida;

  // Lado con más espacio libre; vertical centrado en el pin y dentro de la zona segura.
  const izquierda = cxPin > ancho / 2;
  const zona = ZONA_SEGURA[formato];
  const cardTop = Math.max(
    zona.top,
    Math.min(alto - zona.bottom - CARD_ALTO, cyPin - CARD_ALTO / 2),
  );
  const cardLeft = izquierda
    ? cxPin - PIN / 2 - DISTANCIA - CARD_ANCHO
    : cxPin + PIN / 2 + DISTANCIA;

  const anillos = [0, 1].map((k) => {
    const local = t - (inicio + 0.2) - k * DESFASE_ANILLO;
    if (!pulsoActivo || local < 0 || local >= CICLO * CICLOS) return null;
    const fase = (local % CICLO) / CICLO;
    // El anillo crece con la curva de entrada; la opacidad se apaga con la de salida.
    // Con la de salida en el tamaño, el anillo queda tapado por el pin casi todo el ciclo.
    const d = mezcla(CURVA.entrada(fase), PIN, ANILLO_MAX);
    return (
      <div
        key={k}
        style={{
          position: "absolute",
          left: x - d / 2,
          top: y - d / 2,
          width: d,
          height: d,
          borderRadius: "50%",
          border: `3px solid ${COLOR.dorado}`,
          boxSizing: "border-box",
          opacity: 0.7 * (1 - CURVA.salida(fase)),
        }}
      />
    );
  });

  return (
    <>
      {anillos}
      <div
        style={{
          position: "absolute",
          left: x - PIN / 2,
          top: y - PIN / 2,
          width: PIN,
          height: PIN,
          borderRadius: "50%",
          background: COLOR.dorado,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${escalaPin * (1 - qPin)})`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.35)",
        }}
      >
        {numero === null ? (
          <div
            style={{
              width: CENTRO,
              height: CENTRO,
              borderRadius: "50%",
              background: COLOR.crema,
            }}
          />
        ) : (
          <span
            style={{
              fontFamily: FUENTE.titulo,
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1,
              color: COLOR.navy,
            }}
          >
            {numero}
          </span>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: cardLeft,
          top: cardTop,
          width: CARD_ANCHO,
          height: CARD_ALTO,
          padding: "0 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 2,
          ...estiloPanel(20),
          opacity: pCallout * (1 - qCallout),
          transform: `scale(${mezcla(pCallout, 0.6, 1)})`,
          transformOrigin: izquierda ? "right center" : "left center",
        }}
      >
        {[
          { texto: pin.DETALLE, tam: 32, peso: 700, opacidad: 1 },
          { texto: pin.SECUNDARIO, tam: 28, peso: 500, opacidad: 0.7 },
        ].map((linea) => (
          <div
            key={linea.tam}
            style={{
              fontFamily: FUENTE.dato,
              fontWeight: linea.peso,
              fontSize: linea.tam,
              lineHeight: 1.2,
              color: COLOR.crema,
              opacity: linea.opacidad,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {linea.texto}
          </div>
        ))}
      </div>
    </>
  );
};

export const Pines: React.FC<PropsPines> = ({
  pines,
  formato,
  fondoPreview,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / fps;

  // Salida en orden: el último pin termina de achicarse en el último fotograma.
  const fin = (durationInFrames - 1) / fps;
  const inicioSalida = fin - 0.35 - SALIDA_STAGGER * (pines.length - 1);

  return (
    <AbsoluteFill>
      <FondoPreview tipo={fondoPreview} />
      {pines.map((pin, i) => (
        <UnPin
          key={i}
          pin={pin}
          numero={pines.length > 1 ? i + 1 : null}
          t={t}
          inicio={i * STAGGER_PINES}
          salida={inicioSalida + i * SALIDA_STAGGER}
          formato={formato}
          ancho={width}
          alto={height}
        />
      ))}
    </AbsoluteFill>
  );
};
