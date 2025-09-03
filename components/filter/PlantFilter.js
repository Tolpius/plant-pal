import styled, { css } from "styled-components";
import { useState } from "react";
import PlantFilterForm from "./PlantFilterForm";

export default function PlantFilter({ onFilter, handleHideOwned }) {
  const [showFilter, setShowFilter] = useState(false);

  function handleFilterSubmit(event) {
    console.log(event);
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
      <ButtonContainer>
        <FilterButton
          $displayBorder={showFilter}
          onClick={() => {
            setShowFilter(!showFilter);
          }}
        >
          {!showFilter ? "Filter ⬇️" : "Filter ⬆️"}
        </FilterButton>
      </ButtonContainer>
      {showFilter && (
        <PlantFilterForm
          onSubmit={handleFilterSubmit}
          onClear={handleClearSubmit}
          handleHideOwned={handleHideOwned}
        />
      )}
    </FilterContainer>
  );
}

const FilterContainer = styled.div`
  ${(props) =>
    props.$displayBorder
      ? css`
          border: 1px solid black;
          border-radius: 15px;
          overflow: hidden;
        `
      : css`
          border: none;
        `};
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const FilterButton = styled.button`
  width: 100%;
  padding: 10px 20px;
  background-color: lightgray;
  border-radius: 15px;
  font-size: medium;
  ${(props) =>
    props.$displayBorder
      ? css`
          border: none;
        `
      : css`
          border: 1px solid black;
        `};
`;
