import { fitText } from "@remotion/layout-utils";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FUENTE,
  fuentesListas,
  NUMEROS_TABULARES,
} from "../../sistema/fuentes";
import { mezcla, tramo } from "../../sistema/movimiento";
import {
  COLOR,
  CURVA,
  Formato,
  INTERLINEADO_TITULO,
  PANEL,
  SOMBRA_TEXTO,
} from "../../sistema/tokens";
import { FondoPreview } from "../../sistema/FondoPreview";
import { PropsLowerThird } from "./esquema";

const ALTO = 220;
const BARRA = 8;
const PAD_IZQ = BARRA + 36;
const PAD_DER = 32;

const TITULO_MAX = 56;
const TITULO_MIN = 44;

// Anclaje del panel por formato (x desde la izquierda, y desde abajo).
const LAYOUT: Record<Formato, { izq: number; abajo: number; ancho: number }> = {
  "9x16": { izq: 64, abajo: 470, ancho: 936 },
  "16x9": { izq: 96, abajo: 96, ancho: 760 },
  "4x5": { izq: 64, abajo: 120, ancho: 936 },
};

export const LowerThird: React.FC<PropsLowerThird> = ({
  TIPO,
  BARRIO,
  DIRECCION,
  PRECIO,
  formato,
  conPanel,
  precioSerif,
  fondoPreview,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  // fitText mide con la fuente real: esperar a que cargue antes de medir.
  const [listo, setListo] = useState(false);
  const [handle] = useState(() => delayRender("Cargando fuentes"));
  useEffect(() => {
    fuentesListas.then(() => {
      setListo(true);
      continueRender(handle);
    });
  }, [handle]);

  const { izq, abajo, ancho } = LAYOUT[formato];
  const anchoTexto = ancho - PAD_IZQ - PAD_DER;
  const titulo = `${TIPO} · ${BARRIO}`;
  const tamTitulo = listo
    ? Math.max(
        TITULO_MIN,
        Math.min(
          TITULO_MAX,
          Math.floor(
            fitText({
              text: titulo,
              withinWidth: anchoTexto,
              fontFamily: FUENTE.titulo,
              fontWeight: "700",
            }).fontSize,
          ),
        ),
      )
    : TITULO_MAX;

  // Entrada
  const pBarra = tramo(t, 0, 0.45, CURVA.entrada);
  const pPanel = tramo(t, 0.15, 0.5, CURVA.entrada);
  const pLinea1 = tramo(t, 0.35, 0.45, CURVA.entrada);
  const pLinea2 = tramo(t, 0.44, 0.45, CURVA.entrada);
  const pChip = tramo(t, 0.7, 0.45, CURVA.rebote);
  const pChipOpacidad = tramo(t, 0.7, 0.2, CURVA.entrada);

  // Salida: arranca 0,3 s antes del final y termina en el último fotograma.
  const fin = (durationInFrames - 1) / fps;
  const inicioSalida = fin - 0.267;
  const qTexto = tramo(t, inicioSalida, 0.25, CURVA.salida);
  const qPanel = tramo(t, inicioSalida, fin - inicioSalida, CURVA.salida);

  const textoSale = {
    opacity: 1 - qTexto,
    transform: `translateY(${mezcla(qTexto, 0, 20)}px)`,
  };
  const sombra = conPanel ? undefined : SOMBRA_TEXTO;

  return (
    <AbsoluteFill>
      <FondoPreview tipo={fondoPreview} />
      <div
        style={{
          position: "absolute",
          left: izq,
          bottom: abajo,
          width: ancho,
          height: ALTO,
          borderRadius: PANEL.radio,
          overflow: "hidden",
          clipPath: `inset(0 ${qPanel * 100}% 0 0 round ${PANEL.radio}px)`,
        }}
      >
        {conPanel ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: PANEL.radio,
              background: PANEL.fondo,
              backdropFilter: `blur(${PANEL.desenfoque}px)`,
              WebkitBackdropFilter: `blur(${PANEL.desenfoque}px)`,
              clipPath: `inset(0 ${(1 - pPanel) * 100}% 0 0 round ${PANEL.radio}px)`,
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: BARRA,
            height: ALTO,
            background: COLOR.dorado,
            transform: `scaleY(${pBarra})`,
            transformOrigin: "bottom",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingLeft: PAD_IZQ,
            paddingRight: PAD_DER,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 14,
            ...textoSale,
          }}
        >
          <div
            style={{
              fontFamily: FUENTE.titulo,
              fontWeight: 700,
              fontSize: tamTitulo,
              lineHeight: INTERLINEADO_TITULO,
              color: COLOR.crema,
              textShadow: sombra,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: pLinea1,
              transform: `translateY(${mezcla(pLinea1, 40, 0)}px)`,
            }}
          >
            {titulo}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
                fontFamily: FUENTE.dato,
                fontWeight: 500,
                fontSize: 32,
                lineHeight: 1.2,
                color: COLOR.crema,
                textShadow: sombra,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                opacity: pLinea2 * 0.7,
                transform: `translateY(${mezcla(pLinea2, 40, 0)}px)`,
              }}
            >
              {DIRECCION}
            </div>

            <div
              style={{
                flexShrink: 0,
                padding: "18px 24px",
                borderRadius: 14,
                background: COLOR.dorado,
                color: COLOR.navy,
                fontFamily: precioSerif ? FUENTE.serif : FUENTE.dato,
                fontWeight: 700,
                fontSize: 44,
                lineHeight: INTERLINEADO_TITULO,
                ...NUMEROS_TABULARES,
                whiteSpace: "nowrap",
                opacity: pChipOpacidad,
                transform: `scale(${mezcla(pChip, 0.9, 1)})`,
                transformOrigin: "right center",
              }}
            >
              {PRECIO}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
