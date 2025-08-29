import Image from "next/image";
import styled from "styled-components";

import HeartButton from "./HeartButton";
import Link from "next/link";

export default function Card({ plant, onToggleOwned, isOwned, session }) {
  return (
    <StyledLink
      href={`/plants/${plant._id}`}
      aria-label={`View details for ${plant.name}`}
    >
      <CardWrapper>
        <ImageWrapper>
          <StyledImage
            src={plant.imageUrl || "/defaultImage.png"}
            alt={plant.name}
            width={300}
            height={0}
          />
        </ImageWrapper>
        <TextWrapper>
          {session && (
            <HeartButton
              isOwned={isOwned}
              onToggleOwned={onToggleOwned}
              aria-label={`Toggle owned for ${plant.name}`}
            />
          )}
          <h3>{plant.name}</h3>
          <p>{plant.botanicalName}</p>
        </TextWrapper>
      </CardWrapper>
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  border: 1px black solid;
  border-radius: 25px;
  overflow: hidden;
  height: 300px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
`;

const StyledImage = styled(Image)`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const TextWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80px;
`;
