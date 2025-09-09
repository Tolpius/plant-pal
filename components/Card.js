import Image from "next/image";
import styled from "styled-components";
import OwnedButton from "./OwnedButton";
import OwnedCounter from "./counters/OwnedCounter";
import Link from "next/link";
import useSWR from "swr";

export default function Card({ plant, onAddOwned, isOwnedPlantList }) {
  const { data: count, isLoading } = useSWR(
    !isOwnedPlantList ? `/api/plants/${plant._id}/countowned` : null
  );

  if (isLoading) return null;
  return (
    <StyledLink
      href={isOwnedPlantList ? `/owned/${plant._id}` : ({ pathname: "/plants/[id]", query: { id: plant._id, from: "/catalogue" } })}
      aria-label={`View details for ${plant.name}`}
    >
      <CardWrapper>
        <ImageWrapper>
          <StyledImage
            src={plant.imageUrl || "/defaultImage.png"}
            alt={plant.name ? `Image of ${plant.name}` : "Image of a plant"}
            width={300}
            height={0}
          />
        </ImageWrapper>
        <TextWrapper>
          {!isOwnedPlantList && (
            <>
              <OwnedButton
                onAddOwned={onAddOwned}
                aria-label={`Add plant to owned for ${plant.name}`}
              />
              <OwnedCounter length={count} />
            </>
          )}
          <StyledName aria-label={`Common name: ${plant.name}`}>
            {plant.name}
          </StyledName>
          <StyledBotanicalName
            aria-label={`Botanical name: ${plant.botanicalName}`}
          >
            {plant.botanicalName}
          </StyledBotanicalName>
        </TextWrapper>
      </CardWrapper>
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  border: var(--border-sm-dark);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 300px;
  background-color: var(--color-secondary-dark);
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
  padding: var(--padding-medium);
  font-family: var(--font-primary);
  color: var(--color-neutral-base);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 180px;
`;

const StyledName = styled.h3`
  font-size: var(--font-size-xl);
  padding: var(--padding-small);
`;

const StyledBotanicalName = styled.p`
  font-style: italic;
  color: var(--color-text-medium);
  font-size: var(--font-size-sm);
`;
