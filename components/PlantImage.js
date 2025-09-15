import { useState } from "react";
import Image from "next/image";

const PlantImage = ({ plant, alt = "Plant", width = 200, height = 200, className }) => {asdasdasdasd[//TODO: ANPASSEN AUF MAIN ÄNDERUNGEN!!
  const imageOptions = [
    plant?.storedImageUrl,
    plant?.imageUrl,
    plant?.cataloguePlantId?.storedImageUrl,
    plant?.cataloguePlantId?.imageUrl,
    "/defaultImage.png",
  ].filter(Boolean); 
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleError = () => {
    if (currentIndex < imageOptions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <Image
      src={imageOptions[currentIndex]}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
};

export default PlantImage;
