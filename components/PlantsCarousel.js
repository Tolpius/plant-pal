// PlantCarousel.js
import { useState } from "react";
import styled from "styled-components";
import CardCarousel from "./CardCarousel";

export default function PlantCarousel({ plants }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidth = 220;
  const peek = 40;
  const maxVisible = 2;
  const outerPadding = 32; // Abstand zum Rand

  if (!plants || plants.length === 0) return <p>Keine Pflanzen vorhanden</p>;

  const totalCards = plants.length;

  const prev = () =>
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  const next = () => setActiveIndex((prev) => (prev + 1) % totalCards);

  return (
    <>
      <CarouselOuterWrapper>
        <CarouselWrapper>
          {plants.map((plant, i) => {
            const offset = i - activeIndex;
            let scale = 0.7;
            let xOffset = 0;
            let yOffset = 0;
            let zIndex = 0;
            let opacity = 0;

            const grayScale = Math.min(1, 0.3 * Math.abs(offset));

            if (Math.abs(offset) <= maxVisible) {
              if (offset === 0) {
                scale = 1;
                xOffset = 0;
                yOffset = 0;
                zIndex = 3;
                opacity = 1;
              } else {
                scale = 1 - 0.15 * Math.abs(offset);
                xOffset = offset * peek;
                yOffset = 0;
                zIndex = 3 - Math.abs(offset);
                opacity = 1 - 0.2 * Math.abs(offset);
              }
            }

            return (
              <CardWrapper
                key={plant._id}
                style={{
                  transform: `translateX(calc(${xOffset}px - 50%)) translateY(${yOffset}px) scale(${scale})`,
                  zIndex,
                  opacity: 1,
                  filter: `grayscale(${grayScale})`, // optional, falls du Wrapper schon anpasst
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
  box-sizing: border-box;
  display: flex;
  justify-content: center;
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
  transition: transform 0.3s, opacity 0.3s;
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
