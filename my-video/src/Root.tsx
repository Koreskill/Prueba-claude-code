import "./index.css";
import { Folder } from "remotion";
import { PiezaLowerThird } from "./piezas/01-lower-third";
import { PiezaPrecio } from "./piezas/02-precio";
import { PiezaFicha } from "./piezas/03-ficha";
import { PiezaPlano } from "./piezas/04-plano";
import { PiezaCotas } from "./piezas/05-cotas";
import { PiezaEtiqueta } from "./piezas/06-etiqueta";
import { PiezaPines } from "./piezas/07-pines";
import { PiezaMapa } from "./piezas/08-mapa";
import { PiezaEstado } from "./piezas/09-estado";
import { PiezaProgreso } from "./piezas/10-progreso";
import { PiezaAmenities } from "./piezas/11-amenities";
import { PiezaAntesDespues } from "./piezas/12-antes-despues";
import { PiezaSol } from "./piezas/13-sol";
import { PiezaContacto } from "./piezas/14-contacto";
import { PiezaTransicion } from "./piezas/15-transicion";

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
      <Folder name="08-mapa">
        <PiezaMapa />
      </Folder>
      <Folder name="09-estado">
        <PiezaEstado />
      </Folder>
      <Folder name="10-progreso">
        <PiezaProgreso />
      </Folder>
      <Folder name="11-amenities">
        <PiezaAmenities />
      </Folder>
      <Folder name="12-antes-despues">
        <PiezaAntesDespues />
      </Folder>
      <Folder name="13-sol">
        <PiezaSol />
      </Folder>
      <Folder name="14-contacto">
        <PiezaContacto />
      </Folder>
      <Folder name="15-transicion">
        <PiezaTransicion />
      </Folder>
    </>
  );
};
