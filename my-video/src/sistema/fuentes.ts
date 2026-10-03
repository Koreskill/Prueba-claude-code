import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes locales (OFL) en public/fuentes: el render no depende de la red.
const cargar = (family: string, archivo: string, weight: string) =>
  loadFont({ family, url: staticFile(`fuentes/${archivo}`), weight });

export const FUENTE = {
  titulo: "Montserrat",
  dato: "Inter",
  serif: "Playfair Display",
} as const;

export const fuentesListas = Promise.all([
  cargar(FUENTE.titulo, "montserrat-latin-600-normal.woff2", "600"),
  cargar(FUENTE.titulo, "montserrat-latin-700-normal.woff2", "700"),
  cargar(FUENTE.dato, "inter-latin-500-normal.woff2", "500"),
  cargar(FUENTE.dato, "inter-latin-600-normal.woff2", "600"),
  cargar(FUENTE.dato, "inter-latin-700-normal.woff2", "700"),
  cargar(FUENTE.serif, "playfair-display-latin-700-normal.woff2", "700"),
]);

// Numerales tabulares y de caja alta (Playfair trae cifras elzevirianas por defecto).
export const NUMEROS_TABULARES = {
  fontVariantNumeric: "lining-nums tabular-nums",
} as const;
