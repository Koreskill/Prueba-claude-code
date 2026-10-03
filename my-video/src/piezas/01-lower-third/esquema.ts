import { z } from "zod";

// Las claves coinciden con los marcadores {{TIPO}}, {{BARRIO}}, {{DIRECCION}}, {{PRECIO}}.
export const esquemaLowerThird = z.object({
  TIPO: z.string(),
  BARRIO: z.string(),
  DIRECCION: z.string(),
  PRECIO: z.string(),
  formato: z.enum(["9x16", "16x9", "4x5"]),
  // Sin panel: solo sombra de texto. Usar únicamente sobre planos oscuros.
  conPanel: z.boolean(),
  // Precio en Playfair Display, reservado para gama alta.
  precioSerif: z.boolean(),
  duracion: z.number().min(2).max(12),
  // Solo para revisar en Studio; exportar siempre con "transparente".
  fondoPreview: z.enum(["transparente", "claro", "oscuro"]),
});

export type PropsLowerThird = z.infer<typeof esquemaLowerThird>;

export const propsEjemplo: Omit<PropsLowerThird, "formato"> = {
  TIPO: "Departamento",
  BARRIO: "Palermo",
  DIRECCION: "Av. Santa Fe 1234, 3° B",
  PRECIO: "USD 185.000",
  conPanel: true,
  precioSerif: false,
  duracion: 4,
  fondoPreview: "transparente",
};
