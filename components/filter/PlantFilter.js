import styled, { css } from "styled-components";
import { useState } from "react";
import PlantFilterForm from "./PlantFilterForm";

export default function PlantFilter({ onFilter }) {
  const [showFilter, setShowFilter] = useState(false);

  function handleFilterSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const lightNeed = formData.getAll("lightNeed");
    const waterNeed = formData.getAll("waterNeed");

    onFilter({ lightNeed, waterNeed });
  }

  function handleClearSubmit() {
    onFilter({ lightNeed: [], waterNeed: [] });
  }

  return (
    <FilterContainer $displayBorder={showFilter}>
      <ButtonContainer $sizeOfButton={showFilter}>
        <FilterButton
          $displayBorder={showFilter}
          onClick={() => {
            setShowFilter(!showFilter);
          }}
        >
          <TextWrapper $textPlace={showFilter}>
            <p>{!showFilter ? "Filter ⬇️" : "Filter ⬆️"}</p>
          </TextWrapper>
        </FilterButton>
      </ButtonContainer>
      {showFilter && (
        <PlantFilterForm
          onSubmit={handleFilterSubmit}
          onClear={handleClearSubmit}
        />
      )}
    </FilterContainer>
  );
}

//Container around the whole Filter
//display is only visible when the filter form is also visible
const FilterContainer = styled.div`
  ${(props) =>
    props.$displayBorder
      ? css`
          border: 1px solid black;
          border-radius: 15px;
          overflow: hidden;
        `
      : css`
          border: none:
        `};
`;

//Container around the Filter-Button, sole purpose is to keep the
// Filter text at the same spot when the filter form is opened.
// Works together with the Textwrapper.
const ButtonContainer = styled.div`
  display: grid;
  ${(props) =>
    props.$sizeOfButton
      ? css`
          grid-template-columns: 1fr;
        `
      : css`
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        `};
`;

//Button opens and closes the filter form, also changes the
// apperance of the border, so that the border is not visible
// while the form is open.
const FilterButton = styled.button`
  width: 100%;
  padding: 10px 20px;
  background-color: var(--color-neutral-light);
  border-radius: 15px;
  font-size: var(--font-size-md);
  ${(props) =>
    props.$displayBorder
      ? css`
          border: none;
          border-radius: 0;
        `
      : css`
          border: 1px solid black;
        `};
`;

//Changing the grey box meant changing the Filter Text spot,
// this way, the Text stays where it was and the box is still
// completly grey and clickable.
const TextWrapper = styled.div`
  display: grid;
  ${(props) =>
    props.$textPlace
      ? css`
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        `
      : css`
          grid-template-columns: (1fr - 1rem);
        `};
`;
