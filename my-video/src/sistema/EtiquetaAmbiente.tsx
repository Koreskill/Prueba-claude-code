import { FUENTE } from "./fuentes";
import { COLOR, estiloPanel, SOMBRA_TEXTO } from "./tokens";

// Píldora de ambiente (pieza 06), reutilizada en el plano (pieza 04).
// `escala` 1 = 72 px de alto, texto 36 px. `expandir` abre la píldora desde `origen`.
export const EtiquetaAmbiente: React.FC<{
  texto: string;
  sub?: string;
  escala?: number;
  expandir: number;
  textoVisible: number;
  origen?: "izquierda" | "derecha";
}> = ({
  texto,
  sub,
  escala = 1,
  expandir,
  textoVisible,
  origen = "izquierda",
}) => {
  const alto = 72 * escala;
  const radio = alto / 2;
  const recorte = (1 - expandir) * 100;
  const inset =
    origen === "izquierda"
      ? `inset(0 ${recorte}% 0 0 round ${radio}px)`
      : `inset(0 0 0 ${recorte}% round ${radio}px)`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: origen === "izquierda" ? "flex-start" : "flex-end",
        gap: 8 * escala,
      }}
    >
      <div
        style={{
          height: alto,
          padding: `0 ${32 * escala}px`,
          display: "flex",
          alignItems: "center",
          gap: 14 * escala,
          whiteSpace: "nowrap",
          ...estiloPanel(radio),
          clipPath: inset,
          opacity: expandir > 0 ? 1 : 0,
        }}
      >
        <div
          style={{
            width: 14 * escala,
            height: 14 * escala,
            borderRadius: "50%",
            background: COLOR.dorado,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontFamily: FUENTE.titulo,
            fontWeight: 600,
            fontSize: 36 * escala,
            lineHeight: 1,
            color: COLOR.crema,
            opacity: textoVisible,
          }}
        >
          {texto}
        </div>
      </div>
      {sub ? (
        <div
          style={{
            padding: `0 ${8 * escala}px`,
            fontFamily: FUENTE.dato,
            fontWeight: 500,
            fontSize: 28 * escala,
            lineHeight: 1.2,
            // El 70 % va en el color y no en la opacidad, para no apagar la sombra.
            color: "rgba(247, 243, 236, 0.7)",
            opacity: textoVisible,
            textShadow: SOMBRA_TEXTO,
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};
