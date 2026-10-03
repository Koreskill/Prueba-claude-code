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

// Ventana de salida que termina justo en el último fotograma
// (una pieza de 4 s a 30 fps no tiene fotograma en 4,00 s).
export const ventanaSalida = (
  durationInFrames: number,
  fps: number,
  duracion = 0.3,
) => {
  const fin = (durationInFrames - 1) / fps;
  const real = duracion - 1 / fps;
  return { inicio: fin - real, duracion: real };
};
