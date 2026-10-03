import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FUENTE } from "../../sistema/fuentes";
import { Logo } from "../../sistema/Logo";
import { mezcla, tramo } from "../../sistema/movimiento";
import { COLOR, CURVA } from "../../sistema/tokens";
import { CodigoQR } from "./CodigoQR";
import { PropsContacto } from "./esquema";

const BOTON_ANCHO = 760;
const BOTON_ALTO = 120;
const QR = 280;
const QR_PAD = 20;
const LATIDO = 1.4;

// Ícono genérico de chat con teléfono (no el logotipo de la marca).
const IconoChat: React.FC = () => (
  <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
    <path
      d="M26 4 a22 22 0 0 0 -19 33 L4 48 l11.5 -3 A22 22 0 1 0 26 4 z"
      stroke={COLOR.navy}
      strokeWidth={3.5}
      strokeLinejoin="round"
    />
    <path
      d="M19 15 l4 5 -2.5 2.5 c1 3 4 6 7 7 l2.5 -2.5 5 4 -2.5 3.5 c-3 2 -9 -1 -13 -5 s-7 -10 -5 -13 z"
      fill={COLOR.navy}
    />
  </svg>
);

export const Contacto: React.FC<PropsContacto> = ({
  LOGO,
  MARCA,
  CTA,
  TELEFONO,
  QR: contenidoQR,
  WEB,
  MATRICULA,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, height } = useVideoConfig();
  const t = frame / fps;
  const fin = (durationInFrames - 1) / fps;
  const conTelefono = TELEFONO.trim() !== "";

  const pFondo = tramo(t, 0, 0.5, CURVA.suave);
  const pLogo = tramo(t, 0.3, 0.5, CURVA.entrada);
  const pBoton = tramo(t, 1.1, 0.5, CURVA.rebote);
  const pTextoBoton = tramo(t, 1.1 + 0.35, 0.2, CURVA.entrada);
  const pQR = tramo(t, 1.4, 0.4, CURVA.entrada);
  const pPie = tramo(t, 1.6, 0.4, CURVA.entrada);

  // Latido cada 1,4 s desde 1,8 s; se detiene 2 s antes del final para poder escanear.
  const finLatidos = fin - 2;
  const fase = t >= 1.8 && t < finLatidos ? ((t - 1.8) % LATIDO) / 0.6 : 1;
  const ultimoInicio = 1.8 + Math.floor((t - 1.8) / LATIDO) * LATIDO;
  const latido =
    fase < 1 && ultimoInicio + 0.6 <= finLatidos
      ? interpolate(CURVA.suave(fase), [0, 0.5, 1], [1, 1.03, 1])
      : 1;

  // Cierre: todo se funde a navy en los últimos 0,5 s.
  const q = tramo(t, fin - 0.5, 0.5, CURVA.salida);
  const palabras = CTA.trim().split(/\s+/);

  const yLogo = height * 0.22;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: COLOR.navy,
          opacity: mezcla(pFondo, 0, 0.7) + 0.3 * q,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      />

      <AbsoluteFill style={{ opacity: 1 - q }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: yLogo,
            display: "flex",
            justifyContent: "center",
            transform: `translateY(-50%) scale(${mezcla(pLogo, 0.9, 1)})`,
            opacity: pLogo,
          }}
        >
          <Logo src={LOGO} marca={MARCA} ancho={360} color={COLOR.crema} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 560,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: "0.25em",
            fontFamily: FUENTE.titulo,
            fontWeight: 700,
            fontSize: 72,
            lineHeight: 1.05,
            color: COLOR.crema,
            textAlign: "center",
            // Máximo dos líneas.
            maxHeight: 72 * 1.05 * 2,
            overflow: "hidden",
          }}
        >
          {palabras.map((p, i) => {
            const pp = tramo(t, 0.6 + i * 0.07, 0.45, CURVA.entrada);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: pp,
                  transform: `translateY(${mezcla(pp, 40, 0)}px)`,
                }}
              >
                {p}
              </span>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: conTelefono ? 800 : 780,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 44,
          }}
        >
          {conTelefono ? (
            <div
              style={{
                width: mezcla(pBoton, BOTON_ALTO, BOTON_ANCHO),
                height: BOTON_ALTO,
                borderRadius: BOTON_ALTO / 2,
                background: COLOR.dorado,
                opacity: pBoton > 0 ? 1 : 0,
                transform: `scale(${latido})`,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: pTextoBoton,
                  whiteSpace: "nowrap",
                }}
              >
                <IconoChat />
                <span
                  style={{
                    fontFamily: FUENTE.dato,
                    fontWeight: 700,
                    fontSize: 44,
                    color: COLOR.navy,
                    fontVariantNumeric: "lining-nums tabular-nums",
                  }}
                >
                  {TELEFONO}
                </span>
              </div>
            </div>
          ) : null}

          <div
            style={{
              padding: QR_PAD,
              borderRadius: 20,
              background: COLOR.crema,
              opacity: pQR,
              transform: `scale(${mezcla(pQR, 0.85, 1)})`,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CodigoQR texto={contenidoQR} tamano={QR} color={COLOR.navy} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 440,
            textAlign: "center",
            fontFamily: FUENTE.dato,
            fontWeight: 500,
            fontSize: 28,
            lineHeight: 1.2,
            color: "rgba(247, 243, 236, 0.7)",
            opacity: pPie,
          }}
        >
          {[WEB, MATRICULA].filter((x) => x.trim()).join(" · ")}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
