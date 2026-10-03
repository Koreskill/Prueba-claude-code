import "./index.css";
import { Folder } from "remotion";
import { PiezaLowerThird } from "./piezas/01-lower-third";
import { PiezaPrecio } from "./piezas/02-precio";
import { PiezaFicha } from "./piezas/03-ficha";
import { PiezaPlano } from "./piezas/04-plano";
import { PiezaCotas } from "./piezas/05-cotas";
import { PiezaEtiqueta } from "./piezas/06-etiqueta";
import { PiezaPines } from "./piezas/07-pines";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="01-lower-third">
        <PiezaLowerThird />
      </Folder>
      <Folder name="02-precio">
        <PiezaPrecio />
      </Folder>
      <Folder name="03-ficha">
        <PiezaFicha />
      </Folder>
      <Folder name="04-plano">
        <PiezaPlano />
      </Folder>
      <Folder name="05-cotas">
        <PiezaCotas />
      </Folder>
      <Folder name="06-etiqueta">
        <PiezaEtiqueta />
      </Folder>
      <Folder name="07-pines">
        <PiezaPines />
      </Folder>
    </>
  );
};
