import { Img, staticFile } from "remotion";
import { FUENTE } from "./fuentes";

// Logo monocromático. Con `src` (archivo en public/, idealmente PNG o SVG con
// transparencia) se tiñe del color pedido usando el logo como máscara.
// Sin `src`, muestra la marca como texto para maquetar.
export const Logo: React.FC<{
  src: string;
  marca: string;
  ancho: number;
  color: string;
}> = ({ src, marca, ancho, color }) => {
  if (src.trim()) {
    const url = src.startsWith("http") ? src : staticFile(src);
    return (
      <div style={{ position: "relative", width: ancho }}>
        {/* La imagen invisible da el alto proporcional; la máscara pinta el color. */}
        <Img src={url} style={{ width: ancho, display: "block", opacity: 0 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: color,
            WebkitMaskImage: `url(${url})`,
            maskImage: `url(${url})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        width: ancho,
        textAlign: "center",
        fontFamily: FUENTE.titulo,
        fontWeight: 700,
        fontSize: ancho / 7,
        lineHeight: 1.05,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color,
      }}
    >
      {marca}
    </div>
  );
};
