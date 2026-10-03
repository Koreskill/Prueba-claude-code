import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FUENTE } from "../../sistema/fuentes";
import { Icono } from "../../sistema/Iconos";
import { mezcla, tramo, ventanaSalida } from "../../sistema/movimiento";
import { COLOR, CURVA, estiloPanel, SOMBRA_TEXTO } from "../../sistema/tokens";
import { PropsMapa } from "./esquema";
import { MapaBase } from "./MapaBase";

const R5 = 180;
const R10 = 340;
const PIN_ANCHO = 72;
const PIN_ALTO = 96;
const PUNTO = 44;

// Minutos a pie → radio en px, con los anillos como referencia (5 min = 180, 10 min = 340).
const radioPorMinutos = (min: number) =>
  interpolate(min, [0, 5, 10], [0, R5, R10], {
    extrapolateRight: "extend",
  });

const Gota: React.FC = () => (
  <svg width={PIN_ANCHO} height={PIN_ALTO} viewBox="0 0 72 96">
    <path
      d="M36 96 C36 96 4 58 4 36 a32 32 0 0 1 64 0 c0 22 -32 60 -32 60 z"
      fill={COLOR.dorado}
    />
    <path
      d="M22 38 L36 26 L50 38 V52 H22 z M32 52 V43 H40 V52"
      fill="none"
      stroke={COLOR.crema}
      strokeWidth={4}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

export const Mapa: React.FC<PropsMapa> = ({ BARRIO, puntos }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / fps;
  const fin = (durationInFrames - 1) / fps;

  // Propiedad en el centro del área útil (por encima del panel inferior).
  const cx = width / 2;
  const cy = 860;

  const zoom = mezcla(tramo(t, 0, fin, CURVA.suave), 1.1, 1);
  const pMapa = tramo(t, 0, 0.3, CURVA.suave);
  const pPin = tramo(t, 0.3, 0.6, CURVA.rebote);
  const r5 = R5 * tramo(t, 0.9, 0.7, CURVA.entrada);
  const r10 = R10 * tramo(t, 1.4, 0.7, CURVA.entrada);
  const pPanel = tramo(t, 0.5, 0.45, CURVA.entrada);

  const salida = ventanaSalida(durationInFrames, fps, 0.4);
  const q = tramo(t, salida.inicio, salida.duracion, CURVA.salida);

  const anillo = (r: number) =>
    r > 0 ? (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="rgba(201, 162, 77, 0.08)"
        stroke={COLOR.dorado}
        strokeWidth={3}
        strokeDasharray="12 10"
      />
    ) : null;

  return (
    <AbsoluteFill style={{ opacity: 1 - q }}>
      <AbsoluteFill
        style={{
          opacity: pMapa,
          transform: `scale(${zoom})`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        <MapaBase ancho={width} alto={height} />
        <svg width={width} height={height} style={{ position: "absolute" }}>
          {anillo(r10)}
          {anillo(r5)}
        </svg>

        {puntos.map((p, i) => {
          const r = radioPorMinutos(p.MIN);
          const a = (p.angulo * Math.PI) / 180;
          const x = cx + r * Math.cos(a);
          const y = cy + r * Math.sin(a);
          const s = tramo(t, 2.0 + i * 0.2, 0.3, CURVA.rebote);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -${PUNTO / 2}px) scale(${s})`,
                transformOrigin: `50% ${PUNTO / 2}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                opacity: s > 0 ? 1 : 0,
              }}
            >
              <div
                style={{
                  width: PUNTO,
                  height: PUNTO,
                  borderRadius: "50%",
                  background: COLOR.crema,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                }}
              >
                <Icono
                  nombre={p.tipo}
                  tamano={26}
                  progreso={1}
                  color={COLOR.navy}
                  grosor={2.5}
                />
              </div>
              <div
                style={{
                  fontFamily: FUENTE.dato,
                  fontWeight: 500,
                  fontSize: 28,
                  lineHeight: 1.2,
                  color: COLOR.crema,
                  textShadow: SOMBRA_TEXTO,
                  whiteSpace: "nowrap",
                }}
              >
                {p.NOMBRE} · {p.MIN} min
              </div>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: cx - PIN_ANCHO / 2,
            top: cy - PIN_ALTO,
            opacity: pPin > 0 ? 1 : 0,
            transform: `translateY(${mezcla(pPin, -120, 0)}px)`,
            filter: "drop-shadow(0 6px 10px rgba(0, 0, 0, 0.45))",
          }}
        >
          <Gota />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 440,
          height: 128,
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          ...estiloPanel(24),
          opacity: pPanel,
          transform: `translateY(${mezcla(pPanel, 40, 0)}px)`,
        }}
      >
        <div
          style={{
            width: 8,
            alignSelf: "stretch",
            margin: "28px 0",
            borderRadius: 4,
            background: COLOR.dorado,
          }}
        />
        <div
          style={{
            fontFamily: FUENTE.titulo,
            fontWeight: 700,
            fontSize: 56,
            lineHeight: 1.05,
            color: COLOR.crema,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {BARRIO}
        </div>
      </div>
    </AbsoluteFill>
  );
};
