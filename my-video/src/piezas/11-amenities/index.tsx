import { Composition } from "remotion";
import { metadataReel, REEL } from "../../sistema/reel";
import { FPS } from "../../sistema/tokens";
import { Amenities } from "./Amenities";
import { esquemaAmenities, PropsAmenities, propsEjemplo } from "./esquema";

export const PiezaAmenities: React.FC = () => (
  <Composition
    id="11-amenities-9x16"
    component={Amenities}
    schema={esquemaAmenities}
    defaultProps={propsEjemplo}
    calculateMetadata={metadataReel<PropsAmenities>()}
    fps={FPS}
    durationInFrames={150}
    {...REEL}
  />
);
