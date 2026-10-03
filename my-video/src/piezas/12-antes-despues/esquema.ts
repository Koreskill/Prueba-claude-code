import { z } from "zod";

export const esquemaAntesDespues = z.object({
  // Tomas opcionales (archivo en public/ o URL; imagen o video). Vacías: solo gráfica con alfa.
  ANTES: z.string(),
  DESPUES: z.string(),
  // {{INVERSION}} o {{PLAZO}}; vacío lo oculta.
  DATO: z.string(),
  // grafica: divisor, mango y etiquetas · mascara: blanco = DESPUÉS (máscara de luma para el editor).
  capa: z.enum(["grafica", "mascara"]),
  duracion: z.number().min(5).max(10),
});

export type PropsAntesDespues = z.infer<typeof esquemaAntesDespues>;

export const propsEjemplo: PropsAntesDespues = {
  ANTES: "",
  DESPUES: "",
  DATO: "Inversión USD 18.000 · 45 días",
  capa: "grafica",
  duracion: 6,
};
