import QRCode from "qrcode";
import { useMemo } from "react";

// QR vectorial con margen de silencio de 4 módulos incluido en `tamano`.
const MARGEN = 4;

export const CodigoQR: React.FC<{
  texto: string;
  tamano: number;
  color: string;
}> = ({ texto, tamano, color }) => {
  const { d, total } = useMemo(() => {
    const qr = QRCode.create(texto, { errorCorrectionLevel: "M" });
    const n = qr.modules.size;
    let camino = "";
    for (let fila = 0; fila < n; fila++) {
      for (let col = 0; col < n; col++) {
        if (qr.modules.get(fila, col)) {
          camino += `M${col + MARGEN} ${fila + MARGEN}h1v1h-1z`;
        }
      }
    }
    return { d: camino, total: n + 2 * MARGEN };
  }, [texto]);

  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
    >
      <path d={d} fill={color} />
    </svg>
  );
};
