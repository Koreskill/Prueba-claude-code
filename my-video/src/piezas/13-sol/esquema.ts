import { z } from "zod";

// {{ORIENTACION}}: dato real (brújula, plano o cliente). No sugerir sol de mañana
// si la fachada mira al sur.
export const esquemaSol = z.object({
  ORIENTACION: z.string(),
  // Hacia dónde apunta el norte en el cuadro (grados, 0 = arriba, sentido horario).
  norte: z.number(),
  // grafica: arco, sol, horas y rosa · tinte: capa de color para Soft Light al 35 % en el editor.
  capa: z.enum(["grafica", "tinte"]),
  duracion: z.number().min(5).max(10),
});

export type PropsSol = z.infer<typeof esquemaSol>;

export const propsEjemplo: PropsSol = {
  ORIENTACION: "Balcón al norte",
  norte: 0,
  capa: "grafica",
  duracion: 5,
};
