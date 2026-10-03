import { AbsoluteFill } from "remotion";

// Fondo de prueba para revisar legibilidad en Studio. Nunca se exporta.
export const FondoPreview: React.FC<{
  tipo: "transparente" | "claro" | "oscuro";
}> = ({ tipo }) => {
  if (tipo === "transparente") return null;
  const fondo =
    tipo === "claro"
      ? "linear-gradient(180deg, #e9e4da 0%, #f4efe6 55%, #d8cbb4 56%, #e8dcc6 100%)"
      : "linear-gradient(180deg, #1b2230 0%, #2c3442 55%, #3a3127 56%, #241d16 100%)";
  return <AbsoluteFill style={{ background: fondo }} />;
};
