import { Easing } from "remotion";

// Sistema base compartido por las 15 piezas.

export const FPS = 30;

export const FORMATOS = {
  "9x16": { width: 1080, height: 1920 },
  "16x9": { width: 1920, height: 1080 },
  "4x5": { width: 1080, height: 1350 },
} as const;

export type Formato = keyof typeof FORMATOS;

// Zonas seguras (px). 9:16 deja espacio para la interfaz de Instagram/TikTok.
export const ZONA_SEGURA: Record<
  Formato,
  { top: number; right: number; bottom: number; left: number }
> = {
  "9x16": { top: 250, right: 64, bottom: 420, left: 64 },
  "16x9": { top: 96, right: 96, bottom: 96, left: 96 },
  "4x5": { top: 96, right: 64, bottom: 96, left: 64 },
};

export const COLOR = {
  navy: "#0F1B2D",
  crema: "#F7F3EC",
  dorado: "#C9A24D",
  disponible: "#2FB67C",
  reservado: "#F2A13B",
  vendido: "#D64545",
} as const;

export const PANEL = {
  fondo: "rgba(15, 27, 45, 0.78)",
  desenfoque: 16,
  radio: 20,
} as const;

export const SOMBRA_TEXTO = "0 2px 12px rgba(0, 0, 0, 0.45)";

export const CURVA = {
  entrada: Easing.bezier(0.16, 1, 0.3, 1),
  salida: Easing.bezier(0.7, 0, 0.84, 0),
  suave: Easing.bezier(0.65, 0, 0.35, 1),
  // Solo para pines y sellos.
  rebote: Easing.bezier(0.34, 1.56, 0.64, 1),
} as const;

export const TIEMPO = {
  entrada: 0.45,
  salida: 0.3,
  stagger: 0.09,
} as const;

export const INTERLINEADO_TITULO = 1.05;

// Tiempo mínimo de lectura: 0,8 s + 0,35 s por palabra.
export const tiempoLectura = (texto: string) =>
  0.8 + 0.35 * texto.trim().split(/\s+/).filter(Boolean).length;
