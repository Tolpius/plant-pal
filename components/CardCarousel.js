// CardCarousel.js
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";

export default function CardCarousel({ plant, grayScale }) {
  return (
    <StyledLink
      href={`/plants/${plant._id}`}
      aria-label={`View details for ${plant.name}`}
    >
      <CardWrapper grayScale={grayScale}>
        <StyledImage
          src={plant.imageUrl || "/defaultImage.png"}
          alt={plant.name}
          fill
        />
      </CardWrapper>
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const CardWrapper = styled.div`
  position: relative;
  width: 220px;
  height: 300px;
  border: 1px black solid;
  border-radius: 25px;
  overflow: hidden;
  background-color: white;
  filter: grayscale(${(props) => props.grayScale});
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  border-radius: 25px;
`;
