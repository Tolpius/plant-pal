import { useState } from "react";
import Image from "next/image";

export default function PlantImage ({ plant, ...props }) {
  const imageOptions = [
    plant?.storedImageUrl,
    plant?.userImageUrl,
    plant?.imageUrl,
    plant?.cataloguePlant?.storedImageUrl,
    plant?.cataloguePlant?.imageUrl,
    "/defaultImage.png",
  ].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleError = () => {
    if (currentIndex < imageOptions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    //eslint-disable-next-line
    <Image
      key={currentIndex}
      src={imageOptions[currentIndex]}
      onError={handleError}
      {...props}
    />
  );
};

