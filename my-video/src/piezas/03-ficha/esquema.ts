import { z } from "zod";

// {{DORMITORIOS}}, {{BANOS}}, {{M2}}, {{COCHERAS}}. Un valor vacío oculta su chip.
export const esquemaFicha = z.object({
  DORMITORIOS: z.string(),
  BANOS: z.string(),
  M2: z.string(),
  COCHERAS: z.string(),
  formato: z.enum(["9x16", "16x9", "4x5"]),
  duracion: z.number().min(2).max(12),
  fondoPreview: z.enum(["transparente", "claro", "oscuro"]),
});

export type PropsFicha = z.infer<typeof esquemaFicha>;

export const propsEjemplo: Omit<PropsFicha, "formato"> = {
  DORMITORIOS: "3",
  BANOS: "2",
  M2: "185",
  COCHERAS: "1",
  duracion: 4,
  fondoPreview: "transparente",
};
