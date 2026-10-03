// Mapa estilizado sin datos de terceros: grilla de manzanas con avenidas,
// un curso de agua y una plaza. Colores del sistema de mapa.
export const MAPA = {
  calle: "#0F1B2D",
  manzana: "#16263E",
  verdeAgua: "#1E3556",
} as const;

const MANZANA_ANCHO = 132;
const MANZANA_ALTO = 108;
const CALLE = 16;
const AVENIDA = 34;

export const MapaBase: React.FC<{ ancho: number; alto: number }> = ({
  ancho,
  alto,
}) => {
  const manzanas: React.ReactNode[] = [];
  // Una avenida cada 3 manzanas; la grilla arranca fuera de cuadro para que el zoom no muestre bordes.
  let y = -120;
  for (let fila = 0; y < alto + 120; fila++) {
    const altoFila = MANZANA_ALTO;
    let x = -120;
    for (let col = 0; x < ancho + 120; col++) {
      const plaza = fila === 9 && (col === 1 || col === 2);
      manzanas.push(
        <rect
          key={`${fila}-${col}`}
          x={x}
          y={y}
          width={MANZANA_ANCHO}
          height={altoFila}
          rx={6}
          fill={plaza ? MAPA.verdeAgua : MAPA.manzana}
        />,
      );
      x += MANZANA_ANCHO + (col % 3 === 2 ? AVENIDA : CALLE);
    }
    y += altoFila + (fila % 3 === 2 ? AVENIDA : CALLE);
  }

  return (
    <svg width={ancho} height={alto} style={{ position: "absolute" }}>
      <rect width={ancho} height={alto} fill={MAPA.calle} />
      {manzanas}
      {/* Diagonal y curso de agua para romper la grilla. */}
      <path
        d={`M ${-100} ${alto * 0.18} L ${ancho + 100} ${alto * 0.46}`}
        stroke={MAPA.calle}
        strokeWidth={30}
      />
      <path
        d={`M ${-100} ${alto * 0.07} C ${ancho * 0.3} ${alto * 0.02}, ${ancho * 0.55} ${alto * 0.16}, ${ancho + 100} ${alto * 0.1}`}
        stroke={MAPA.verdeAgua}
        strokeWidth={110}
        fill="none"
      />
    </svg>
  );
};
