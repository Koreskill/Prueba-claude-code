import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "../../sistema/Logo";
import { mezcla, tramo } from "../../sistema/movimiento";
import { COLOR, CURVA } from "../../sistema/tokens";
import { PropsTransicion } from "./esquema";

// 0,8 s. El cuadrado cubre todo el cuadro en el fotograma 11 (índice 10): ahí va el corte de A a B.
export const FOTOGRAMA_CORTE = 10;

export const Transicion: React.FC<PropsTransicion> = ({ LOGO, MARCA }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = frame / fps;
  const fin = (durationInFrames - 1) / fps;
  const corte = FOTOGRAMA_CORTE / fps;

  // El lado cubre el alto del cuadro; las esquinas redondeadas quedan fuera a los costados.
  const lado = height + 40;
  const crece = tramo(t, 0, corte, CURVA.suave);

  // Logo retenido entre el corte y la apertura.
  const enLogo = t >= corte && t < 0.55;
  const escalaLogo = mezcla(
    tramo(t, corte, 0.55 - corte, CURVA.suave),
    0.95,
    1,
  );

  // Apertura: máscara circular desde el centro, termina en el último fotograma.
  const radioMax = Math.hypot(width / 2, height / 2) + 4;
  const abre = tramo(t, 0.55, fin - 0.55, CURVA.entrada) * radioMax;
  const mascara =
    abre > 0
      ? `radial-gradient(circle at 50% 50%, transparent ${abre}px, #000 ${abre + 1}px)`
      : undefined;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          WebkitMaskImage: mascara,
          maskImage: mascara,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: width / 2 - lado / 2,
            top: height / 2 - lado / 2,
            width: lado,
            height: lado,
            borderRadius: 24 / Math.max(crece, 0.05),
            background: COLOR.dorado,
            transform: `scale(${crece})`,
          }}
        />
        {enLogo ? (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${escalaLogo})`,
            }}
          >
            <Logo src={LOGO} marca={MARCA} ancho={240} color={COLOR.navy} />
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
