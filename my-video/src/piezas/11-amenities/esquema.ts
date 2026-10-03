import { z } from "zod";

// {{AMENITY}} por fila, hasta 5 y de hasta 22 caracteres: si no entra, acortar el texto.
export const esquemaAmenities = z.object({
  TITULO: z.string(),
  amenities: z.array(z.string().max(22)).min(1).max(5),
  duracion: z.number().min(3).max(10),
});

export type PropsAmenities = z.infer<typeof esquemaAmenities>;

export const propsEjemplo: PropsAmenities = {
  TITULO: "Incluye",
  amenities: ["Pileta", "SUM", "Seguridad 24 h", "Parrilla", "Gimnasio"],
  duracion: 5,
};
