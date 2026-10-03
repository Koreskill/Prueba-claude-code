import "./index.css";
import { Folder } from "remotion";
import { PiezaLowerThird } from "./piezas/01-lower-third";
import { PiezaPrecio } from "./piezas/02-precio";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="01-lower-third">
        <PiezaLowerThird />
      </Folder>
      <Folder name="02-precio">
        <PiezaPrecio />
      </Folder>
    </>
  );
};
