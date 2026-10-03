import { z } from "zod";

// Las claves coinciden con los marcadores {{MONEDA}}, {{PRECIO}}, {{LEYENDA}}, {{PRECIO_ANTERIOR}}.
export const esquemaPrecio = z.object({
  MONEDA: z.string(),
  // Tal como se lee en pantalla, con separadores: "185.000".
  PRECIO: z.string(),
  LEYENDA: z.string(),
  // Solo para la variante rebaja.
  PRECIO_ANTERIOR: z.string(),
  formato: z.enum(["9x16", "16x9", "4x5"]),
  // tambor: dígitos suben desde máscara · contador: giran de 0 al valor (hasta 6 dígitos)
  // rebaja: precio anterior tachado y luego el nuevo.
  variante: z.enum(["tambor", "contador", "rebaja"]),
  duracion: z.number().min(2).max(12),
  fondoPreview: z.enum(["transparente", "claro", "oscuro"]),
});

export type PropsPrecio = z.infer<typeof esquemaPrecio>;

export const propsEjemplo: Omit<PropsPrecio, "formato"> = {
  MONEDA: "USD",
  PRECIO: "185.000",
  LEYENDA: "Financiación disponible",
  PRECIO_ANTERIOR: "210.000",
  variante: "tambor",
  duracion: 3.5,
  fondoPreview: "transparente",
};
