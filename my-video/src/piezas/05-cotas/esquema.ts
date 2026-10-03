import { z } from "zod";

const punto = z.tuple([z.number(), z.number()]);

// Cota de A a B sobre el borde del objeto medido. `lado` (1 o -1) elige hacia qué
// lado de la normal se desplaza la línea de cota (30 px del objeto).
const cota = z.object({
  a: punto,
  b: punto,
  lado: z.union([z.literal(1), z.literal(-1)]),
});

// {{ANCHO}}, {{LARGO}}, {{M2}}: datos del cliente, nunca estimados por el editor.
export const esquemaCotas = z.object({
  ANCHO: z.string(),
  LARGO: z.string(),
  M2: z.string(),
  formato: z.enum(["9x16", "16x9", "4x5"]),
  cotaAncho: cota,
  cotaLargo: cota,
  // Contorno del piso (px) para la trama.
  piso: z.array(punto).min(3),
  duracion: z.number().min(2).max(12),
  fondoPreview: z.enum(["transparente", "claro", "oscuro"]),
});

export type PropsCotas = z.infer<typeof esquemaCotas>;
type Punto = [number, number];

const rect = (x0: number, y0: number, x1: number, y1: number): Punto[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

// Geometría de ejemplo por formato: un piso visto desde arriba.
const GEOMETRIA = {
  "9x16": [160, 1060, 860, 1400],
  "16x9": [560, 520, 1360, 880],
  "4x5": [160, 700, 860, 1100],
} as const;

export const propsEjemplo = (formato: PropsCotas["formato"]): PropsCotas => {
  const [x0, y0, x1, y1] = GEOMETRIA[formato];
  return {
    ANCHO: "7,00",
    LARGO: "4,20",
    M2: "29,4",
    formato,
    cotaAncho: { a: [x0, y1], b: [x1, y1], lado: 1 },
    cotaLargo: { a: [x1, y0], b: [x1, y1], lado: -1 },
    piso: rect(x0, y0, x1, y1),
    duracion: 3.5,
    fondoPreview: "transparente",
  };
};
