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

// Trazo animado: con pathLength=1, el dasharray recorre el trazo de 0 a 1.
// Oculto en p=0 para que la terminación redonda no deje un punto.
export const trazo = (p: number) =>
  ({
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - p,
    opacity: p > 0 ? 1 : 0,
  }) as const;

// Números en formato rioplatense: 1.250 · 85,5
export const formatearNumero = (valor: number, decimales: number) =>
  valor.toLocaleString("es-AR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });

// "185" → 185 · "85,5" → 85.5 · "1.250" → 1250
export const leerNumero = (texto: string) => {
  const limpio = texto.trim().replace(/\./g, "").replace(",", ".");
  const valor = Number(limpio);
  const decimales = limpio.includes(".") ? limpio.split(".")[1].length : 0;
  return { valor: Number.isFinite(valor) ? valor : 0, decimales };
};
