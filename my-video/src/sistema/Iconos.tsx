import { trazo } from "./movimiento";
import { COLOR } from "./tokens";

// Íconos lineales en una grilla de 56 × 56: trazo 4 px, terminaciones y uniones redondeadas.
// Cada trazo se dibuja con pathLength=1 para animarlo con `progreso`.
const TRAZOS: Record<NombreIcono, string[]> = {
  cama: [
    "M8 12 V44",
    "M8 36 H48 V44",
    "M8 28 H42 a6 6 0 0 1 6 6 v2",
    "M14 21 a3 3 0 0 1 3 -3 h8 a3 3 0 0 1 3 3 v7 h-14 z",
  ],
  banera: [
    "M6 28 H50 v4 a12 12 0 0 1 -12 12 H18 a12 12 0 0 1 -12 -12 z",
    "M16 44 l-3 6 M40 44 l3 6",
    "M14 28 V14 a5 5 0 0 1 10 0 v2",
  ],
  superficie: [
    "M10 10 h36 v36 h-36 z",
    "M19 37 L37 19",
    "M29 19 h8 v8 M19 29 v8 h8",
  ],
  auto: [
    "M8 36 v-8 l5 -11 a4 4 0 0 1 4 -3 h22 a4 4 0 0 1 4 3 l5 11 v8 a2 2 0 0 1 -2 2 H10 a2 2 0 0 1 -2 -2 z",
    "M11 28 H45",
    "M12 38 v4 a2 2 0 0 0 2 2 h4 a2 2 0 0 0 2 -2 v-4 M36 38 v4 a2 2 0 0 0 2 2 h4 a2 2 0 0 0 2 -2 v-4",
    "M16 33 h3 M37 33 h3",
  ],
};

export type NombreIcono = "cama" | "banera" | "superficie" | "auto";

export const Icono: React.FC<{
  nombre: NombreIcono;
  tamano: number;
  progreso: number;
  color?: string;
}> = ({ nombre, tamano, progreso, color = COLOR.crema }) => (
  <svg
    width={tamano}
    height={tamano}
    viewBox="0 0 56 56"
    fill="none"
    stroke={color}
    strokeWidth={4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, overflow: "visible" }}
  >
    {TRAZOS[nombre].map((d, i, todos) => (
      <path
        key={i}
        d={d}
        vectorEffect="non-scaling-stroke"
        // Los trazos se dibujan uno tras otro, como un solo gesto.
        {...trazo(Math.max(0, Math.min(1, progreso * todos.length - i)))}
      />
    ))}
  </svg>
);
