import { CalculateMetadataFunction } from "remotion";
import { FORMATOS, FPS } from "./tokens";

// Desde la pieza 08: una sola versión 9:16 con fondo transparente.
export const REEL = FORMATOS["9x16"];

export const metadataReel =
  <P extends { duracion: number }>(): CalculateMetadataFunction<P> =>
  ({ props }) => ({
    ...REEL,
    durationInFrames: Math.round(props.duracion * FPS),
  });
