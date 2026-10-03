import { z } from "zod";

const pin = z.object({
  x: z.number(),
  y: z.number(),
  DETALLE: z.string(),
  SECUNDARIO: z.string(),
  // Tracking opcional exportado del editor: posiciones del pin en el tiempo (s, px).
  seguimiento: z
    .array(z.object({ t: z.number(), x: z.number(), y: z.number() }))
    .optional(),
});

// {{DETALLE}} y {{SECUNDARIO}} por pin. Hasta 3 pines por plano.
export const esquemaPines = z.object({
  pines: z.array(pin).min(1).max(3),
  formato: z.enum(["9x16", "16x9", "4x5"]),
  duracion: z.number().min(2).max(8),
  fondoPreview: z.enum(["transparente", "claro", "oscuro"]),
});

export type PropsPines = z.infer<typeof esquemaPines>;
export type Pin = z.infer<typeof pin>;

const POSICIONES = {
  "9x16": [
    [300, 820],
    [760, 1050],
    [420, 1300],
  ],
  "16x9": [
    [560, 380],
    [1340, 560],
    [760, 780],
  ],
  "4x5": [
    [300, 480],
    [760, 690],
    [420, 900],
  ],
} as const;

const TEXTOS = [
  ["Pisos de madera", "Roble natural"],
  ["Vista al río", "Desde el balcón"],
  ["Aire acondicionado", "En todos los ambientes"],
];

export const propsEjemplo = (formato: PropsPines["formato"]): PropsPines => ({
  pines: POSICIONES[formato].map(([x, y], i) => ({
    x,
    y,
    DETALLE: TEXTOS[i][0],
    SECUNDARIO: TEXTOS[i][1],
  })),
  formato,
  duracion: 3,
  fondoPreview: "transparente",
});
