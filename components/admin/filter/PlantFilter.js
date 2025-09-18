import styled, { css } from "styled-components";
import { useState } from "react";
import PlantFilterForm from "./PlantFilterForm";

export default function PlantFilter({ onFilter }) {
  const [showFilter, setShowFilter] = useState(false);

  function handleFilterSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const isPublic = formData.getAll("isPublic");
    const parsed =
      isPublic[0] === "true" ? true : isPublic[0] === "false" ? false : "all";
    onFilter({ isPublic: parsed });
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
      {showFilter && <PlantFilterForm onSubmit={handleFilterSubmit} />}
    </FilterContainer>
  );
}

//Container around the whole Filter
//display is only visible when the filter form is also visible
const FilterContainer = styled.div`
  ${(props) =>
    props.$displayBorder
      ? css`
          border: var(--border-sm-dark);
          border-radius: 15px;
          overflow: hidden;
        `
      : css`
          border: none;
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
  background-color: var(--color-primary-light);
  border-radius: var(--radius-bg-md);
  font-size: var(--font-size-md);
  ${(props) =>
    props.$displayBorder
      ? css`
          border: none;
          border-radius: 0;
        `
      : css`
          border: var(--border-sm-dark);
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
          grid-template-columns: 1fr;
        `};
`;
