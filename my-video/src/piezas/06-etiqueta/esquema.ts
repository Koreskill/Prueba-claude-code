import { z } from "zod";

// {{AMBIENTE}} y {{M2}} (opcional: vacío lo oculta). Una sola etiqueta por plano.
export const esquemaEtiqueta = z.object({
  AMBIENTE: z.string(),
  M2: z.string(),
  formato: z.enum(["9x16", "16x9", "4x5"]),
  // Punto de ancla sobre el objeto (px). Sin línea guía es la posición de la píldora.
  ancla: z.tuple([z.number(), z.number()]),
  // Hacia dónde sale la línea guía a 45°: elegir el tercio libre del cuadro.
  direccion: z.enum([
    "arribaDerecha",
    "arribaIzquierda",
    "abajoDerecha",
    "abajoIzquierda",
  ]),
  // false: solo la píldora flotando, para planos con cámara en movimiento.
  conLinea: z.boolean(),
  duracion: z.number().min(1.5).max(5),
  fondoPreview: z.enum(["transparente", "claro", "oscuro"]),
});

export type PropsEtiqueta = z.infer<typeof esquemaEtiqueta>;

const ANCLA = {
  "9x16": [380, 1100],
  "16x9": [760, 640],
  "4x5": [380, 760],
} as const;

export const propsEjemplo = (
  formato: PropsEtiqueta["formato"],
): PropsEtiqueta => ({
  AMBIENTE: "Cocina",
  M2: "12",
  formato,
  ancla: [...ANCLA[formato]],
  direccion: "arribaDerecha",
  conLinea: true,
  duracion: 2.5,
  fondoPreview: "transparente",
});
