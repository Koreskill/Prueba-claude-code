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
  subte: [
    "M14 8 h28 a6 6 0 0 1 6 6 v22 a6 6 0 0 1 -6 6 H14 a6 6 0 0 1 -6 -6 V14 a6 6 0 0 1 6 -6 z",
    "M8 26 H48",
    "M18 34 h2 M36 34 h2",
    "M18 42 l-6 8 M38 42 l6 8",
  ],
  escuela: [
    "M4 22 L28 10 L52 22 L28 34 z",
    "M14 27 v12 c0 4 6 7 14 7 s14 -3 14 -7 v-12",
    "M52 22 v14",
  ],
  parque: [
    "M28 8 a12 12 0 0 1 12 12 a10 10 0 0 1 -4 18 H20 a10 10 0 0 1 -4 -18 a12 12 0 0 1 12 -12 z",
    "M28 26 V50",
    "M20 50 H36",
  ],
  comercio: ["M10 18 H46 L43 48 H13 z", "M20 24 V16 a8 8 0 0 1 16 0 v8"],
  tilde: ["M14 29 L24 39 L42 19"],
  auto: [
    "M8 36 v-8 l5 -11 a4 4 0 0 1 4 -3 h22 a4 4 0 0 1 4 3 l5 11 v8 a2 2 0 0 1 -2 2 H10 a2 2 0 0 1 -2 -2 z",
    "M11 28 H45",
    "M12 38 v4 a2 2 0 0 0 2 2 h4 a2 2 0 0 0 2 -2 v-4 M36 38 v4 a2 2 0 0 0 2 2 h4 a2 2 0 0 0 2 -2 v-4",
    "M16 33 h3 M37 33 h3",
  ],
};

export type NombreIcono =
  | "cama"
  | "banera"
  | "superficie"
  | "auto"
  | "subte"
  | "escuela"
  | "parque"
  | "comercio"
  | "tilde";

export const Icono: React.FC<{
  nombre: NombreIcono;
  tamano: number;
  progreso: number;
  color?: string;
  // Grosor en px de pantalla (no escala con el tamaño del ícono).
  grosor?: number;
}> = ({ nombre, tamano, progreso, color = COLOR.crema, grosor = 4 }) => (
  <svg
    width={tamano}
    height={tamano}
    viewBox="0 0 56 56"
    fill="none"
    stroke={color}
    strokeWidth={grosor}
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
