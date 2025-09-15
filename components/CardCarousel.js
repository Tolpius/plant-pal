// CardCarousel.js
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";

export default function CardCarousel({ plant, grayScale }) {
  return (
    <StyledLink
      href={{
        pathname: "/plants/[id]",

        query: { id: plant._id, from: "/" },
      }}
      aria-label={`View details for ${plant.name}`}
    >
      <CardWrapper>
        <StyledImage
          src={plant.imageUrl}
          alt={plant.name ? `Image of ${plant.name}` : "Image of a plant"}
          fill
          grayScale={grayScale}
        />
      </CardWrapper>
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color-black);
`;

const CardWrapper = styled.div`
  position: relative;
  width: 220px;
  height: 300px;
  border: var(--border-sm-dark);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-neutral-highlight);
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  border-radius: var(--radius-lg);
  filter: ${(props) => `grayscale(${props.grayScale})`};
`;
