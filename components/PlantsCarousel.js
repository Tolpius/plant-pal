// PlantCarousel.js
import { useState, useEffect } from "react";
import styled from "styled-components";
import CardCarousel from "./CardCarousel";

export default function PlantCarousel({ plants }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = 220;
  const peek = 40;
  const maxVisible = 2;
  const totalCards = plants.length;

  if (!plants || totalCards === 0) return <p>Keine Pflanzen vorhanden</p>;

  const prev = () =>
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  const next = () => setActiveIndex((prev) => (prev + 1) % totalCards);

  // Berechne Offset mit Endlos-Loop (Modulo)
  const getOffset = (i) => {
    let offset = i - activeIndex;
    if (offset > totalCards / 2) offset -= totalCards;
    if (offset < -totalCards / 2) offset += totalCards;
    return offset;
  };

  return (
    <>
      <CarouselOuterWrapper>
        <CarouselWrapper>
          {plants.map((plant, i) => {
            const offset = getOffset(i);

            if (Math.abs(offset) > maxVisible) return null;

            const scale = offset === 0 ? 1 : 1 - 0.15 * Math.abs(offset);
            const xOffset = offset * peek;
            const grayScale = Math.min(1, 0.3 * Math.abs(offset));
            const zIndex = 3 - Math.abs(offset);

            return (
              <CardWrapper
                key={plant._id}
                style={{
                  transform: `translateX(calc(${xOffset}px - 50%)) scale(${scale})`,
                  zIndex,
                  filter: `grayscale(${grayScale})`,
                  transition: "transform 0.5s ease, filter 0.5s ease",
                }}
              >
                <CardCarousel plant={plant} grayScale={grayScale} />
              </CardWrapper>
            );
          })}
        </CarouselWrapper>
      </CarouselOuterWrapper>

      <ButtonsWrapper>
        <NavButton onClick={prev}>◀</NavButton>
        <PlantName>{plants[activeIndex].name}</PlantName>
        <NavButton onClick={next}>▶</NavButton>
      </ButtonsWrapper>
    </>
  );
}

// Styled Components
const CarouselOuterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;

const CarouselWrapper = styled.div`
  position: relative;
  height: 300px;
`;

const CardWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 220px;
  transition: transform 0.5s ease, filter 0.5s ease;
`;

const ButtonsWrapper = styled.div`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.8);
  border: none;
  font-size: 1.5rem;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
`;

const PlantName = styled.div`
  font-weight: bold;
  text-align: center;
  flex: 1;
`;
