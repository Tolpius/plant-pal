import Image from "next/image";
import styled from "styled-components";

export default function Card({ plant }) {
  return (
    <>
      <StyledImage
        src={plant.imageUrl}
        alt={plant.name}
        width={300}
        height={0}
      />
      <p>{plant.name}</p>
      <p>{plant.botanicalName}</p>
    </>
  );
}

const StyledImage = styled(Image)`
  height: auto;
  width: 20%;
  object-fit: contain;
`;
