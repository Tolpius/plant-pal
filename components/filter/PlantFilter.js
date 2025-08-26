import styled, { css } from "styled-components";
import { useState } from "react";

import PlantFilterForm from "./PlantFilterForm";

export default function PlantFilter({ data, setFilteredPlants }) {
  const [showFilter, setShowFilter] = useState(false);

  function handleFilterSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const lightNeed = formData.getAll("lightNeed");
    const waterNeed = formData.getAll("waterNeed");

    const filtered = data.filter((plant) => {
      const matchesLight =
        lightNeed.length === 0 || lightNeed.includes(plant.lightNeed);
      const matchesWater =
        waterNeed.length === 0 || waterNeed.includes(plant.waterNeed);

      return matchesLight && matchesWater;
    });
    setFilteredPlants(filtered);
  }

  function handleClearSubmit() {
    setFilteredPlants(undefined);
  }

  return (
    <FilterContainer $showFilter={showFilter}>
      <ButtonContainer>
        <FilterButton
          $showFilter={showFilter}
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
        />
      )}
    </FilterContainer>
  );
}

const FilterContainer = styled.div`
  ${(props) =>
    props.$showFilter &&
    css`
      border: 1px solid black;
      border-radius: 15px;
      overflow: hidden;
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
    props.$showFilter
      ? css`
          border: none;
        `
      : css`
          border: 1px solid black;
        `};
`;
