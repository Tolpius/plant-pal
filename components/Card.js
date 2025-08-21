import Image from "next/image";
import styled from "styled-components";

export default function Card({ plant }) {
  return (
    <CardWrapper>
      <StyledImage
        src={plant.imageUrl}
        alt={plant.name}
        width={300}
        height={0}
      />
      <p>{plant.name}</p>
      <p>{plant.botanicalName}</p>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StyledImage = styled(Image)`
  height: auto;
  width: 100%;
  object-fit: contain;
`;
