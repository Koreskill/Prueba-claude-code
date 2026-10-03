import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FUENTE } from "../../sistema/fuentes";
import { mezcla, tramo, trazo } from "../../sistema/movimiento";
import {
  COLOR,
  CURVA,
  estiloPanel,
  SOMBRA_TEXTO,
  ZONA_SEGURA,
} from "../../sistema/tokens";
import { PropsSol } from "./esquema";

const RADIO = 400;
const CX = 540;
// Ápice del arco a 200 px del borde superior de la zona segura.
const HORIZONTE = ZONA_SEGURA["9x16"].top + 200 + RADIO;
const SOL = 56;
const HALO = 120;
const ROSA = 96;

// Gris 50 % es neutro en Soft Light: sin tinte.
const NEUTRO = "#808080";
const COLORES_DIA = ["#FFD9A0", "#FFFFFF", "#FF9A5C"];
const NOCHE = "#2B3F6B";

const HORAS = [
  { texto: "8 h", p: 0 },
  { texto: "13 h", p: 0.5 },
  { texto: "18 h", p: 1 },
];

export const Sol: React.FC<PropsSol> = ({ ORIENTACION, norte, capa }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const fin = (durationInFrames - 1) / fps;

  const pSol = tramo(t, 0.8, 3.2, CURVA.suave);
  const pNoche = tramo(t, 4.0, 0.6, CURVA.suave);
  const inicioSalida = Math.min(4.6, fin - 0.3);
  const q = tramo(t, inicioSalida, 0.3, CURVA.salida);

  if (capa === "tinte") {
    const dia = interpolateColors(pSol, [0, 0.5, 1], COLORES_DIA);
    const conNoche = interpolateColors(pNoche, [0, 1], [dia, NOCHE]);
    // Entra con el sol (0,5–0,8 s) y vuelve a neutro en la salida.
    const intensidad =
      tramo(t, 0.5, 0.3, CURVA.suave) *
      (1 - tramo(t, inicioSalida, 0.3, CURVA.suave));
    return (
      <AbsoluteFill
        style={{
          background: interpolateColors(intensidad, [0, 1], [NEUTRO, conNoche]),
        }}
      />
    );
  }

  const pArco = tramo(t, 0, 0.7, CURVA.entrada);
  const pAparece = tramo(t, 0.5, 0.35, CURVA.rebote);
  const theta = Math.PI * (1 - pSol);
  const sx = CX + RADIO * Math.cos(theta);
  const sy = HORIZONTE - RADIO * Math.sin(theta);
  const pRosa = tramo(t, 0.3, 0.45, CURVA.entrada);

  const arco = `M ${CX - RADIO} ${HORIZONTE} A ${RADIO} ${RADIO} 0 0 1 ${CX + RADIO} ${HORIZONTE}`;

  return (
    <AbsoluteFill style={{ opacity: 1 - q }}>
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.45))",
        }}
      >
        <defs>
          {/* El trazo animado va en una máscara para no pisar el punteado del arco. */}
          <mask id="trazoArco">
            <path
              d={arco}
              fill="none"
              stroke="#fff"
              strokeWidth={12}
              {...trazo(pArco)}
            />
          </mask>
        </defs>
        <path
          d={arco}
          fill="none"
          stroke={COLOR.crema}
          strokeWidth={3}
          strokeDasharray="10 10"
          mask="url(#trazoArco)"
        />
        <line
          x1={CX - RADIO - 20}
          y1={HORIZONTE}
          x2={CX + RADIO + 20}
          y2={HORIZONTE}
          stroke="rgba(247, 243, 236, 0.5)"
          strokeWidth={2}
          opacity={pArco}
        />
      </svg>

      {HORAS.map((h) => {
        // La marca se ilumina cuando el sol pasa por su hora.
        const encendida =
          interpolate(pSol, [h.p - 0.06, h.p], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * (pAparece > 0 ? 1 : 0);
        const x = CX + RADIO * Math.cos(Math.PI * (1 - h.p));
        return (
          <div
            key={h.texto}
            style={{
              position: "absolute",
              left: x - 60,
              width: 120,
              top: HORIZONTE + 14,
              textAlign: "center",
              fontFamily: FUENTE.dato,
              fontWeight: 600,
              fontSize: 28,
              lineHeight: 1.2,
              color: interpolateColors(
                encendida,
                [0, 1],
                ["rgba(247,243,236,0.6)", COLOR.dorado],
              ),
              textShadow: SOMBRA_TEXTO,
              opacity: pArco,
            }}
          >
            {h.texto}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: sx - HALO / 2,
          top: sy - HALO / 2,
          width: HALO,
          height: HALO,
          borderRadius: "50%",
          background: "rgba(201, 162, 77, 0.3)",
          filter: "blur(24px)",
          transform: `scale(${pAparece})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: sx - SOL / 2,
          top: sy - SOL / 2,
          width: SOL,
          height: SOL,
          borderRadius: "50%",
          background: COLOR.dorado,
          boxShadow: "0 0 18px rgba(201, 162, 77, 0.6)",
          transform: `scale(${pAparece})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: ZONA_SEGURA["9x16"].bottom + 24,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: pRosa,
          transform: `translateY(${mezcla(pRosa, 24, 0)}px)`,
        }}
      >
        <div
          style={{
            width: ROSA,
            height: ROSA,
            boxSizing: "border-box",
            border: `3px solid ${COLOR.crema}`,
            ...estiloPanel(ROSA / 2),
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `rotate(${norte}deg)`,
            }}
          >
            <svg width={ROSA - 6} height={ROSA - 6} viewBox="0 0 90 90">
              <polygon points="45,30 53,58 45,52 37,58" fill={COLOR.dorado} />
              <text
                x={45}
                y={24}
                textAnchor="middle"
                fontFamily={FUENTE.titulo}
                fontWeight={700}
                fontSize={20}
                fill={COLOR.crema}
              >
                N
              </text>
            </svg>
          </div>
        </div>
        <div
          style={{
            height: 64,
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            ...estiloPanel(32),
            fontFamily: FUENTE.dato,
            fontWeight: 700,
            fontSize: 32,
            color: COLOR.crema,
            whiteSpace: "nowrap",
          }}
        >
          {ORIENTACION}
        </div>
      </div>
    </AbsoluteFill>
  );
};
