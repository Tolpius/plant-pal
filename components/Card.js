import Image from "next/image";
import styled from "styled-components";

export default function Card({ plant }) {
  return (
    <CardWrapper>
      <ImageWrapper>
        <StyledImage
          src={plant.imageUrl}
          alt={plant.name}
          width={300}
          height={0}
        />
      </ImageWrapper>
      <p>{plant.name}</p>
      <p>{plant.botanicalName}</p>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  border: 1px black solid;
  border-radius: 25px;
  overflow: hidden;
  height: 320px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  height: auto;
  width: 100%;
  object-fit: cover;
`;
