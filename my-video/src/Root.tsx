import "./index.css";
import { Folder } from "remotion";
import { PiezaLowerThird } from "./piezas/01-lower-third";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="01-lower-third">
      <PiezaLowerThird />
    </Folder>
  );
};
