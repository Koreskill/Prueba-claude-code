import { z } from "zod";

// {{SUP_TOTAL}}. El plano vectorial vive en plano.ts.
export const esquemaPlano = z.object({
  SUP_TOTAL: z.string(),
  formato: z.enum(["9x16", "16x9", "4x5"]),
  // sobreVideo: navy 70 % + desenfoque sobre el video · portada: línea fina blanca sobre navy sólido.
  estilo: z.enum(["sobreVideo", "portada"]),
  mostrarNombres: z.boolean(),
  duracion: z.number().min(4).max(12),
  fondoPreview: z.enum(["transparente", "claro", "oscuro"]),
});

export type PropsPlano = z.infer<typeof esquemaPlano>;

export const propsEjemplo: Omit<PropsPlano, "formato"> = {
  SUP_TOTAL: "88",
  estilo: "sobreVideo",
  mostrarNombres: true,
  duracion: 6,
  fondoPreview: "transparente",
};
