import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FUENTE } from "../../sistema/fuentes";
import { Icono } from "../../sistema/Iconos";
import { mezcla, tramo } from "../../sistema/movimiento";
import { COLOR, CURVA, estiloPanel, SOMBRA_TEXTO } from "../../sistema/tokens";
import { PropsAmenities } from "./esquema";

const ANCHO = 520;
const FILA = 96;
const PAD_V = 20;
const PAD_H = 20;
const CIRCULO = 44;
const DERECHA = 64;
const ABAJO = 520;
const RITMO = 0.45;
const SALIDA_STAGGER = 0.05;

export const Amenities: React.FC<PropsAmenities> = ({ TITULO, amenities }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const fin = (durationInFrames - 1) / fps;
  const alto = FILA * amenities.length + 2 * PAD_V;

  // Entrada: desliza 80 px desde la derecha y crece en alto desde abajo.
  const pPanel = tramo(t, 0, 0.45, CURVA.entrada);
  // Salida: filas de arriba hacia abajo (50 ms) y después se retira el panel; termina en el último fotograma.
  const inicioSalida = fin - 0.3 - SALIDA_STAGGER * (amenities.length - 1);
  const qPanel = tramo(t, fin - 0.2, 0.2, CURVA.salida);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: DERECHA,
          bottom: ABAJO,
          width: ANCHO,
          opacity: 1 - qPanel,
          transform: `translateX(${mezcla(pPanel, 80, 0) + mezcla(qPanel, 0, 80)}px)`,
        }}
      >
        {TITULO.trim() ? (
          <div
            style={{
              marginBottom: 16,
              fontFamily: FUENTE.titulo,
              fontWeight: 700,
              fontSize: 40,
              lineHeight: 1.05,
              color: COLOR.dorado,
              textShadow: SOMBRA_TEXTO,
              opacity: tramo(t, 0.2, 0.35, CURVA.entrada),
            }}
          >
            {TITULO}
          </div>
        ) : null}
        <div
          style={{
            height: alto,
            padding: `${PAD_V}px ${PAD_H}px`,
            boxSizing: "border-box",
            ...estiloPanel(24),
            opacity: pPanel > 0 ? 1 : 0,
            clipPath: `inset(${(1 - pPanel) * 100}% 0 0 0 round 24px)`,
          }}
        >
          {amenities.map((texto, i) => {
            const inicio = 0.5 + i * RITMO;
            const pCirculo = tramo(t, inicio, 0.25, CURVA.rebote);
            const pTilde = tramo(t, inicio + 0.2, 0.2, CURVA.entrada);
            const pTexto = tramo(t, inicio + 0.1, 0.35, CURVA.entrada);
            const q = tramo(
              t,
              inicioSalida + i * SALIDA_STAGGER,
              0.2,
              CURVA.salida,
            );
            return (
              <div
                key={i}
                style={{
                  height: FILA,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  borderTop:
                    i === 0 ? undefined : "1px solid rgba(247, 243, 236, 0.15)",
                  opacity: 1 - q,
                }}
              >
                <div
                  style={{
                    width: CIRCULO,
                    height: CIRCULO,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: COLOR.dorado,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${pCirculo})`,
                  }}
                >
                  <Icono
                    nombre="tilde"
                    tamano={CIRCULO}
                    progreso={pTilde}
                    color={COLOR.navy}
                    grosor={4}
                  />
                </div>
                <div
                  style={{
                    minWidth: 0,
                    fontFamily: FUENTE.dato,
                    fontWeight: 500,
                    fontSize: 36,
                    lineHeight: 1.2,
                    color: COLOR.crema,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    opacity: pTexto,
                    transform: `translateX(${mezcla(pTexto, 24, 0)}px)`,
                  }}
                >
                  {texto}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
