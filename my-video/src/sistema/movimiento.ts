import { interpolate } from "remotion";

type Curva = (t: number) => number;

// Progreso 0→1 de un tramo que empieza en `inicio` (s) y dura `duracion` (s).
export const tramo = (
  t: number,
  inicio: number,
  duracion: number,
  curva: Curva,
) =>
  interpolate(t, [inicio, inicio + duracion], [0, 1], {
    easing: curva,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const mezcla = (p: number, desde: number, hasta: number) =>
  desde + (hasta - desde) * p;
