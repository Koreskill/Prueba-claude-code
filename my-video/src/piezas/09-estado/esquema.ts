import { z } from "zod";

// {{ESTADO}}. "Vendido" solo con confirmación del cliente.
export const esquemaEstado = z.object({
  ESTADO: z.enum(["Nuevo", "Reservado", "Vendido", "Rebajado", "Oportunidad"]),
  cinta: z.boolean(),
  sello: z.boolean(),
  // false en gama alta: sin temblor, el sello entra con fundido de 250 ms.
  temblor: z.boolean(),
  duracion: z.number().min(2).max(60),
});

export type PropsEstado = z.infer<typeof esquemaEstado>;

export const propsEjemplo: PropsEstado = {
  ESTADO: "Reservado",
  cinta: true,
  sello: true,
  temblor: true,
  duracion: 4,
};
