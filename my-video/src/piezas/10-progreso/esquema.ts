import { z } from "zod";

// Un tramo por ambiente con su duración real en el video (s). La pieza dura la suma.
export const esquemaProgreso = z.object({
  ambientes: z
    .array(z.object({ AMBIENTE: z.string(), segundos: z.number().min(1) }))
    .min(2),
});

export type PropsProgreso = z.infer<typeof esquemaProgreso>;

export const propsEjemplo: PropsProgreso = {
  ambientes: [
    { AMBIENTE: "Living", segundos: 6 },
    { AMBIENTE: "Cocina", segundos: 5 },
    { AMBIENTE: "Suite", segundos: 6 },
    { AMBIENTE: "Baño", segundos: 3 },
    { AMBIENTE: "Dormitorio", segundos: 4 },
    { AMBIENTE: "Balcón", segundos: 6 },
  ],
};
