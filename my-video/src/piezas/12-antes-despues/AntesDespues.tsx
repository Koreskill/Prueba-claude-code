import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FUENTE } from "../../sistema/fuentes";
import { mezcla, tramo, ventanaSalida } from "../../sistema/movimiento";
import { COLOR, CURVA, estiloPanel, ZONA_SEGURA } from "../../sistema/tokens";
import { PropsAntesDespues } from "./esquema";

const MANGO = 72;
const ARRIBA = ZONA_SEGURA["9x16"].top + 16;

// Posición de la cortina (0 = solo ANTES, 1 = solo DESPUÉS).
export const cortina = (t: number) => {
  if (t < 2.7) return 0.5 * tramo(t, 1.8, 0.7, CURVA.suave);
  if (t < 4.0) return 0.5 + 0.5 * tramo(t, 2.7, 0.7, CURVA.suave);
  return 1 - 0.5 * tramo(t, 4.0, 0.8, CURVA.suave);
};

const Toma: React.FC<{ src: string }> = ({ src }) => {
  const url = src.startsWith("http") ? src : staticFile(src);
  const estilo = { width: "100%", height: "100%", objectFit: "cover" } as const;
  return /\.(mp4|mov|webm|m4v)$/i.test(src) ? (
    <OffthreadVideo src={url} style={estilo} muted />
  ) : (
    <Img src={url} style={estilo} />
  );
};

const Etiqueta: React.FC<{
  texto: string;
  fondo: string;
  color: string;
  lado: "left" | "right";
  opacidad: number;
  desliza: number;
}> = ({ texto, fondo, color, lado, opacidad, desliza }) => (
  <div
    style={{
      position: "absolute",
      top: ARRIBA,
      [lado]: 64,
      height: 56,
      padding: "0 26px",
      display: "flex",
      alignItems: "center",
      ...(fondo === "panel"
        ? estiloPanel(28)
        : { background: fondo, borderRadius: 28 }),
      fontFamily: FUENTE.titulo,
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: "0.08em",
      color,
      opacity: opacidad,
      transform: `translateY(${desliza}px)`,
    }}
  >
    {texto}
  </div>
);

export const AntesDespues: React.FC<PropsAntesDespues> = ({
  ANTES,
  DESPUES,
  DATO,
  capa,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / fps;

  // Después de volver al centro, el mango "respira" ±10 px.
  const respira =
    t > 4.8
      ? 10 *
        Math.sin(((t - 4.8) / 1.2) * 2 * Math.PI) *
        tramo(t, 4.8, 0.3, CURVA.suave)
      : 0;
  const x = cortina(t) * width + respira;

  if (capa === "mascara") {
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: x,
            background: "#fff",
          }}
        />
      </AbsoluteFill>
    );
  }

  const salida = ventanaSalida(durationInFrames, fps, 0.4);
  const q = tramo(t, salida.inicio, salida.duracion, CURVA.salida);
  const pAntes = tramo(t, 0, 0.3, CURVA.entrada);
  const pMango = tramo(t, 1.5, 0.25, CURVA.rebote);
  const pDespues = tramo(t, 3.4, 0.3, CURVA.entrada);
  const pDato = tramo(t, 3.6, 0.45, CURVA.entrada);
  const xMango = Math.min(width - MANGO / 2, Math.max(MANGO / 2, x));

  return (
    <AbsoluteFill>
      {ANTES.trim() ? (
        <AbsoluteFill>
          <Toma src={ANTES} />
        </AbsoluteFill>
      ) : null}
      {DESPUES.trim() ? (
        <AbsoluteFill style={{ clipPath: `inset(0 ${width - x}px 0 0)` }}>
          <Toma src={DESPUES} />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{ opacity: 1 - q }}>
        {/* La cortina revela DESPUÉS desde la izquierda: cada etiqueta va del lado de su toma. */}
        <Etiqueta
          texto="ANTES"
          fondo="panel"
          color={COLOR.crema}
          lado="right"
          opacidad={pAntes * mezcla(pDespues, 1, 0.4)}
          desliza={mezcla(pAntes, -16, 0)}
        />
        <Etiqueta
          texto="DESPUÉS"
          fondo={COLOR.dorado}
          color={COLOR.navy}
          lado="left"
          opacidad={pDespues}
          desliza={mezcla(pDespues, -16, 0)}
        />

        {pMango > 0 ? (
          <>
            <div
              style={{
                position: "absolute",
                left: x - 2,
                top: 0,
                width: 4,
                height,
                background: COLOR.crema,
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.5)",
                opacity: Math.min(1, pMango),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: xMango - MANGO / 2,
                top: height / 2 - MANGO / 2,
                width: MANGO,
                height: MANGO,
                borderRadius: "50%",
                background: COLOR.crema,
                boxShadow: "0 0 16px rgba(0, 0, 0, 0.5)",
                transform: `scale(${pMango})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={48} height={24} viewBox="0 0 48 24">
                <polygon points="0,12 14,2 14,22" fill={COLOR.navy} />
                <polygon points="48,12 34,2 34,22" fill={COLOR.navy} />
              </svg>
            </div>
          </>
        ) : null}

        {DATO.trim() ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 470,
              display: "flex",
              justifyContent: "center",
              opacity: pDato,
              transform: `translateY(${mezcla(pDato, 40, 0)}px)`,
            }}
          >
            <div
              style={{
                padding: "22px 36px",
                ...estiloPanel(20),
                fontFamily: FUENTE.dato,
                fontWeight: 700,
                fontSize: 40,
                lineHeight: 1.2,
                color: COLOR.crema,
                fontVariantNumeric: "lining-nums tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {DATO}
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
