import { z } from "zod";

// Punto de interés: {{NOMBRE}} · {{MIN}} min. La distancia al pin se calcula con los
// minutos a pie (anillos de 5 y 10 min); `angulo` (grados, 0 = derecha, 90 = abajo)
// lo orienta como en el mapa real. Verificar los tiempos en un mapa real (80 m/min).
const punto = z.object({
  tipo: z.enum(["subte", "escuela", "parque", "comercio"]),
  NOMBRE: z.string(),
  MIN: z.number().min(1).max(15),
  angulo: z.number(),
});

export const esquemaMapa = z.object({
  BARRIO: z.string(),
  puntos: z.array(punto).max(4),
  duracion: z.number().min(4).max(10),
});

export type PropsMapa = z.infer<typeof esquemaMapa>;

export const propsEjemplo: PropsMapa = {
  BARRIO: "Palermo",
  puntos: [
    { tipo: "subte", NOMBRE: "Subte D", MIN: 4, angulo: 15 },
    { tipo: "parque", NOMBRE: "Plaza", MIN: 3, angulo: 165 },
    { tipo: "escuela", NOMBRE: "Escuela", MIN: 8, angulo: 50 },
    { tipo: "comercio", NOMBRE: "Supermercado", MIN: 7, angulo: -130 },
  ],
  duracion: 6,
};
