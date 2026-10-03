import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FondoPreview } from "../../sistema/FondoPreview";
import { FUENTE, NUMEROS_TABULARES } from "../../sistema/fuentes";
import { mezcla, tramo, trazo, ventanaSalida } from "../../sistema/movimiento";
import { COLOR, CURVA, estiloPanel } from "../../sistema/tokens";
import { PropsCotas } from "./esquema";

type Punto = [number, number];

const SEPARACION = 30;
const HUECO_EXTENSION = 6;
const SOBRANTE_EXTENSION = 12;
const FLECHA = 14;
const SALIDA = 0.25;
const SALIDA_STAGGER = 0.05;

// Las líneas son crema: una sombra suave las separa de pisos claros.
const SOMBRA_TRAZO = "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.45))";

const suma = (a: Punto, b: Punto, k = 1): Punto => [
  a[0] + b[0] * k,
  a[1] + b[1] * k,
];

const Cota: React.FC<{
  a: Punto;
  b: Punto;
  lado: 1 | -1;
  texto: string;
  t: number;
  inicio: number;
  salida: number;
}> = ({ a, b, lado, texto, t, inicio, salida }) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const largo = Math.hypot(dx, dy);
  const dir: Punto = [dx / largo, dy / largo];
  const normal: Punto = [-dir[1] * lado, dir[0] * lado];

  const pExt = tramo(t, inicio, 0.15, CURVA.entrada);
  const pLinea = tramo(t, inicio + 0.15, 0.6, CURVA.entrada);
  const pPildora = tramo(t, inicio + 0.6, 0.45, CURVA.rebote);
  const pPildoraOpacidad = tramo(t, inicio + 0.6, 0.15, CURVA.entrada);
  const q = tramo(t, salida, SALIDA, CURVA.salida);

  const a2 = suma(a, normal, SEPARACION);
  // La punta de la flecha B viaja con el trazo y se fija al llegar.
  const punta = suma(a2, dir, largo * pLinea);
  const medio = suma(a2, dir, largo / 2);
  const angulo = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI;

  const extension = (p: Punto) => {
    const desde = suma(p, normal, HUECO_EXTENSION);
    const hasta = suma(p, normal, SEPARACION + SOBRANTE_EXTENSION);
    return (
      <line
        x1={desde[0]}
        y1={desde[1]}
        x2={hasta[0]}
        y2={hasta[1]}
        stroke={COLOR.crema}
        strokeWidth={3}
        {...trazo(pExt)}
      />
    );
  };

  const flecha = (p: Punto, giro: number) => (
    <polygon
      points={`0,0 ${-FLECHA},${-FLECHA / 2} ${-FLECHA},${FLECHA / 2}`}
      fill={COLOR.crema}
      transform={`translate(${p[0]} ${p[1]}) rotate(${giro})`}
    />
  );

  return (
    <AbsoluteFill style={{ opacity: 1 - q }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", filter: SOMBRA_TRAZO }}
      >
        {extension(a)}
        {extension(b)}
        {pLinea > 0 ? (
          <>
            <line
              x1={a2[0] + dir[0] * FLECHA}
              y1={a2[1] + dir[1] * FLECHA}
              x2={punta[0] - dir[0] * FLECHA * Math.min(1, pLinea * 4)}
              y2={punta[1] - dir[1] * FLECHA * Math.min(1, pLinea * 4)}
              stroke={COLOR.crema}
              strokeWidth={4}
            />
            {flecha(a2, angulo + 180)}
            {flecha(punta, angulo)}
          </>
        ) : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: medio[0],
          top: medio[1],
          transform: `translate(-50%, -50%) scale(${mezcla(pPildora, 0.85, 1)})`,
          opacity: pPildoraOpacidad,
          height: 64,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          ...estiloPanel(32),
          fontFamily: FUENTE.dato,
          fontWeight: 700,
          fontSize: 36,
          color: COLOR.crema,
          whiteSpace: "nowrap",
          ...NUMEROS_TABULARES,
        }}
      >
        {texto} m
      </div>
    </AbsoluteFill>
  );
};

const centroide = (puntos: Punto[]): Punto => {
  let area = 0;
  let cx = 0;
  let cy = 0;
  puntos.forEach(([x0, y0], i) => {
    const [x1, y1] = puntos[(i + 1) % puntos.length];
    const f = x0 * y1 - x1 * y0;
    area += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  });
  return [cx / (3 * area), cy / (3 * area)];
};

export const Cotas: React.FC<PropsCotas> = ({
  ANCHO,
  LARGO,
  M2,
  cotaAncho,
  cotaLargo,
  piso,
  fondoPreview,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / fps;

  // Salida en orden inverso: m² y trama, cota 2, cota 1. La última termina en el último fotograma.
  const ventana = ventanaSalida(durationInFrames, fps, SALIDA);
  const salidaM2 = ventana.inicio - 2 * SALIDA_STAGGER;
  const salidaCota2 = salidaM2 + SALIDA_STAGGER;
  const salidaCota1 = salidaCota2 + SALIDA_STAGGER;
  const qM2 = tramo(t, salidaM2, SALIDA, CURVA.salida);

  const pTrama = tramo(t, 1.8, 0.5, CURVA.entrada);
  const pM2 = tramo(t, 2.0, 0.45, CURVA.rebote);
  const pM2Opacidad = tramo(t, 2.0, 0.15, CURVA.entrada);

  const xs = piso.map((p) => p[0]);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const [cx, cy] = centroide(piso);

  return (
    <AbsoluteFill>
      <FondoPreview tipo={fondoPreview} />

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: 1 - qM2 }}
      >
        <defs>
          <pattern
            id="trama"
            width={18}
            height={18}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={18}
              stroke={COLOR.dorado}
              strokeWidth={2}
            />
          </pattern>
          <clipPath id="barrido">
            <rect
              x={xMin}
              y={0}
              width={(xMax - xMin) * pTrama}
              height={height}
            />
          </clipPath>
        </defs>
        <polygon
          points={piso.map((p) => p.join(",")).join(" ")}
          fill="url(#trama)"
          opacity={0.25}
          clipPath="url(#barrido)"
        />
      </svg>

      <Cota
        {...cotaAncho}
        texto={ANCHO}
        t={t}
        inicio={0}
        salida={salidaCota1}
      />
      <Cota
        {...cotaLargo}
        texto={LARGO}
        t={t}
        inicio={1.1}
        salida={salidaCota2}
      />

      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transform: `translate(-50%, -50%) scale(${mezcla(pM2, 0.85, 1)})`,
          opacity: pM2Opacidad * (1 - qM2),
          height: 80,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          borderRadius: 40,
          background: COLOR.dorado,
          fontFamily: FUENTE.dato,
          fontWeight: 700,
          fontSize: 44,
          color: COLOR.navy,
          whiteSpace: "nowrap",
          ...NUMEROS_TABULARES,
        }}
      >
        {M2} m²
      </div>
    </AbsoluteFill>
  );
};
