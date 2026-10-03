import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FondoPreview } from "../../sistema/FondoPreview";
import { FUENTE, NUMEROS_TABULARES } from "../../sistema/fuentes";
import { mezcla, tramo, ventanaSalida } from "../../sistema/movimiento";
import {
  COLOR,
  CURVA,
  INTERLINEADO_TITULO,
  SOMBRA_TEXTO,
} from "../../sistema/tokens";
import { Cifra, contarDigitos, MAX_DIGITOS_CONTADOR } from "./Cifra";
import { PropsPrecio } from "./esquema";

const TAM_CIFRA = 140;
const TAM_MONEDA = 56;
const TAM_ANTERIOR = 64;

// Métricas de Montserrat (unidades/1000) para alinear la moneda a la
// línea de mayúsculas de la cifra.
const ASCENDENTE = 0.968;
const DESCENDENTE = 0.251;
const ALTURA_MAYUS = 0.7;
const topeMayus = (tam: number, interlineado: number) =>
  ((interlineado - ASCENDENTE - DESCENDENTE) * tam) / 2 +
  (ASCENDENTE - ALTURA_MAYUS) * tam;

const NAVY_RGB = "15, 27, 45";

// Rebaja: el precio anterior entra, se tacha y recién después entra el nuevo.
const ANTERIOR_ENTRA = 0.2;
const TACHADO = 0.7;
const TACHADO_DUR = 0.25;
const DEMORA_NUEVO = 0.2;

export const RevelaPrecio: React.FC<PropsPrecio> = ({
  MONEDA,
  PRECIO,
  LEYENDA,
  PRECIO_ANTERIOR,
  variante,
  fondoPreview,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, height } = useVideoConfig();
  const t = frame / fps;

  const rebaja = variante === "rebaja";
  const contador =
    variante === "contador" && contarDigitos(PRECIO) <= MAX_DIGITOS_CONTADOR;

  // En la rebaja, toda la secuencia del precio nuevo se corre.
  const desfase = rebaja ? TACHADO + TACHADO_DUR + DEMORA_NUEVO - 0.2 : 0;
  const t0 = 0.2 + desfase;

  const pFondo = tramo(t, 0, 0.3, CURVA.suave);
  const pMoneda = tramo(t, t0 + 0.6, 0.45, CURVA.rebote);
  const pMonedaOpacidad = tramo(t, t0 + 0.6, 0.2, CURVA.entrada);
  const pLinea = tramo(t, t0 + 0.8, 0.4, CURVA.entrada);
  const pLeyenda = tramo(t, t0 + 1.0, 0.35, CURVA.entrada);

  const pAnterior = tramo(t, ANTERIOR_ENTRA, 0.45, CURVA.entrada);
  const pTachado = tramo(t, TACHADO, TACHADO_DUR, CURVA.entrada);

  const salida = ventanaSalida(durationInFrames, fps);
  const q = tramo(t, salida.inicio, salida.duracion, CURVA.salida);
  const qFondo = tramo(t, salida.inicio, salida.duracion, CURVA.suave);

  const yCifra = height * 0.38;
  const altoCifra = TAM_CIFRA * INTERLINEADO_TITULO;

  return (
    <AbsoluteFill>
      <FondoPreview tipo={fondoPreview} />

      {/* Navy 0 % abajo → 55 % a la altura del precio, sostenido hasta arriba. */}
      <AbsoluteFill
        style={{
          opacity: pFondo * (1 - qFondo),
          background: `linear-gradient(to top, rgba(${NAVY_RGB}, 0) 0%, rgba(${NAVY_RGB}, 0.55) 62%, rgba(${NAVY_RGB}, 0.55) 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: yCifra - altoCifra / 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1 - q,
          transform: `translateY(${mezcla(q, 0, -40)}px)`,
        }}
      >
        {rebaja ? (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              marginBottom: 12,
              opacity: pAnterior,
              transform: `translateY(${mezcla(pAnterior, 40, 0)}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FUENTE.titulo,
                fontWeight: 600,
                fontSize: TAM_ANTERIOR,
                lineHeight: 1,
                color: COLOR.crema,
                opacity: 0.5,
                textShadow: SOMBRA_TEXTO,
                whiteSpace: "nowrap",
                ...NUMEROS_TABULARES,
              }}
            >
              {MONEDA} {PRECIO_ANTERIOR}
            </div>
            <div
              style={{
                position: "absolute",
                left: -8,
                right: -8,
                top: "52%",
                height: 6,
                marginTop: -3,
                borderRadius: 3,
                background: COLOR.vendido,
                transform: `scaleX(${pTachado})`,
                transformOrigin: "left",
              }}
            />
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div
            style={{
              fontFamily: FUENTE.titulo,
              fontWeight: 700,
              fontSize: TAM_MONEDA,
              lineHeight: 1,
              color: COLOR.dorado,
              marginTop:
                topeMayus(TAM_CIFRA, INTERLINEADO_TITULO) -
                topeMayus(TAM_MONEDA, 1),
              opacity: pMonedaOpacidad,
              transform: `scale(${mezcla(pMoneda, 0.8, 1)})`,
              textShadow: SOMBRA_TEXTO,
            }}
          >
            {MONEDA}
          </div>
          <div
            style={{
              fontFamily: FUENTE.titulo,
              fontWeight: 700,
              fontSize: TAM_CIFRA,
              lineHeight: INTERLINEADO_TITULO,
              color: COLOR.crema,
              textShadow: SOMBRA_TEXTO,
              ...NUMEROS_TABULARES,
            }}
          >
            <Cifra
              texto={PRECIO}
              t={t}
              inicio={t0}
              tamano={TAM_CIFRA}
              interlineado={INTERLINEADO_TITULO}
              contador={contador}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            fontFamily: FUENTE.dato,
            fontWeight: 500,
            fontSize: 30,
            lineHeight: 1.2,
            color: COLOR.crema,
            textShadow: SOMBRA_TEXTO,
            opacity: pLeyenda,
          }}
        >
          {LEYENDA}
        </div>

        <div
          style={{
            marginTop: 18,
            width: 360,
            height: 6,
            borderRadius: 3,
            background: COLOR.dorado,
            transform: `scaleX(${pLinea})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
