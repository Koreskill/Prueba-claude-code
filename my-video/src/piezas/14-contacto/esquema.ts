import { z } from "zod";

export const esquemaContacto = z.object({
  // Logo en public/ (PNG/SVG con transparencia); vacío muestra MARCA como texto.
  LOGO: z.string(),
  MARCA: z.string(),
  CTA: z.string(),
  // Vacío: versión sin teléfono (solo QR).
  TELEFONO: z.string(),
  // Contenido del QR (por ejemplo https://wa.me/549...). Probarlo con dos teléfonos antes de exportar.
  QR: z.string().min(1),
  WEB: z.string(),
  MATRICULA: z.string(),
  duracion: z.number().min(4).max(8),
});

export type PropsContacto = z.infer<typeof esquemaContacto>;

export const propsEjemplo: PropsContacto = {
  LOGO: "",
  MARCA: "Tu Inmobiliaria",
  CTA: "Visitá la propiedad",
  TELEFONO: "+54 9 11 0000-0000",
  QR: "https://example.com",
  WEB: "tuinmobiliaria.com",
  MATRICULA: "Mat. 0000",
  duracion: 5,
};
