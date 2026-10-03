import { fitText } from "@remotion/layout-utils";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FUENTE, fuentesListas } from "../../sistema/fuentes";
import { mezcla, tramo, ventanaSalida } from "../../sistema/movimiento";
import { COLOR, CURVA, ZONA_SEGURA } from "../../sistema/tokens";
import { PropsEstado } from "./esquema";

// Oportunidad no tiene color en la especificación: navy con texto dorado.
const COLORES: Record<PropsEstado["ESTADO"], { fondo: string; texto: string }> =
  {
    Nuevo: { fondo: COLOR.dorado, texto: COLOR.navy },
    Reservado: { fondo: COLOR.reservado, texto: COLOR.navy },
    Vendido: { fondo: COLOR.vendido, texto: COLOR.crema },
    Rebajado: { fondo: COLOR.disponible, texto: COLOR.navy },
    Oportunidad: { fondo: COLOR.navy, texto: COLOR.dorado },
  };

// Cinta: esquina virtual en (0, 250) para quedar debajo de la zona de interfaz.
const ESQUINA_Y = ZONA_SEGURA["9x16"].top;
const CINTA_LARGO = 520;
const CINTA_ALTO = 84;
const CINTA_CENTRO = 130;
const CAJA = 340;

// Sello
const SELLO = 280;
const ARO_EXT = 6;
const SEPARACION = 8;
const ARO_INT = 2;
const SELLO_CENTRO: [number, number] = [770, 560];
const GIRO = -12;

const Estrella: React.FC<{ tam: number; color: string }> = ({ tam, color }) => {
  const puntos = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? tam / 2 : tam / 5;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${tam / 2 + r * Math.cos(a)},${tam / 2 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={tam} height={tam}>
      <polygon points={puntos} fill={color} />
    </svg>
  );
};

export const Estado: React.FC<PropsEstado> = ({
  ESTADO,
  cinta,
  sello,
  temblor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const { fondo, texto } = COLORES[ESTADO];
  const palabra = ESTADO.toUpperCase();

  const [listo, setListo] = useState(false);
  const [handle] = useState(() => delayRender("Cargando fuentes"));
  useEffect(() => {
    fuentesListas.then(() => {
      setListo(true);
      continueRender(handle);
    });
  }, [handle]);

  const salida = ventanaSalida(durationInFrames, fps);
  const q = tramo(t, salida.inicio, salida.duracion, CURVA.salida);

  // Cinta: entra desde fuera del cuadro por la diagonal de la esquina y sale igual.
  const pCinta = tramo(t, 0, 0.45, CURVA.entrada);
  const fuera = mezcla(pCinta, -260, 0) + mezcla(q, 0, -260);
  const pBrillo = tramo(t, 0.45, 0.6, CURVA.suave);

  // Sello: cae con escala y giro; impacto con temblor de 6 px durante 150 ms.
  const pSello = tramo(t, 0, 0.3, CURVA.rebote);
  const escalaSello = temblor ? mezcla(pSello, 1.6, 1) : 1;
  const giroSello = temblor ? mezcla(pSello, -30, GIRO) : GIRO;
  const opacidadSello = temblor
    ? tramo(t, 0, 0.08, CURVA.entrada)
    : tramo(t, 0, 0.25, CURVA.suave);
  const enImpacto = temblor && t >= 0.3 && t < 0.45;
  const sacudida = enImpacto ? (frame % 2 === 0 ? 6 : -6) : 0;
  const pulso = interpolate(
    tramo(t, 0.4, 0.4, CURVA.suave),
    [0, 0.5, 1],
    [1, 1.06, 1],
  );

  const diametroTexto = SELLO - 2 * (ARO_EXT + SEPARACION + ARO_INT) - 40;
  const tamTexto = listo
    ? Math.min(
        52,
        fitText({
          text: palabra,
          withinWidth: diametroTexto,
          fontFamily: FUENTE.titulo,
          fontWeight: "700",
        }).fontSize,
      )
    : 52;

  return (
    <AbsoluteFill
      style={{ transform: `translate(${sacudida}px, ${sacudida / 2}px)` }}
    >
      {cinta ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: ESQUINA_Y,
            width: CAJA,
            height: CAJA,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: CINTA_CENTRO - CINTA_LARGO / 2 + fuera,
              top: CINTA_CENTRO - CINTA_ALTO / 2 + fuera,
              width: CINTA_LARGO,
              height: CINTA_ALTO,
              transform: "rotate(-45deg)",
              background: fondo,
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontFamily: FUENTE.titulo,
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: "0.06em",
                color: texto,
              }}
            >
              {palabra}
            </span>
            {pBrillo > 0 && pBrillo < 1 ? (
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  bottom: -20,
                  width: 90,
                  left: mezcla(pBrillo, -120, CINTA_LARGO + 30),
                  background: "rgba(255, 255, 255, 0.35)",
                  transform: "skewX(-20deg)",
                }}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {sello ? (
        <div
          style={{
            position: "absolute",
            left: SELLO_CENTRO[0] - SELLO / 2,
            top: SELLO_CENTRO[1] - SELLO / 2,
            width: SELLO,
            height: SELLO,
            borderRadius: "50%",
            background: fondo,
            opacity: opacidadSello * (1 - q),
            transform: `rotate(${giroSello}deg) scale(${escalaSello})`,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `${ARO_EXT}px solid ${texto}`,
              transform: `scale(${pulso})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: ARO_EXT + SEPARACION,
              borderRadius: "50%",
              border: `${ARO_INT}px solid ${texto}`,
            }}
          />
          <Estrella tam={40} color={texto} />
          <span
            style={{
              fontFamily: FUENTE.titulo,
              fontWeight: 700,
              fontSize: tamTexto,
              lineHeight: 1,
              color: texto,
            }}
          >
            {palabra}
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
