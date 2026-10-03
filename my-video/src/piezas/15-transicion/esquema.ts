import { z } from "zod";

export const esquemaTransicion = z.object({
  LOGO: z.string(),
  MARCA: z.string(),
});

export type PropsTransicion = z.infer<typeof esquemaTransicion>;

export const propsEjemplo: PropsTransicion = {
  LOGO: "",
  MARCA: "Tu Inmobiliaria",
};
