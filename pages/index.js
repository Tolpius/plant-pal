import useSWR from "swr";
import styled, { css } from "styled-components";

import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/PlantFilter";
import { useState } from "react";
import PlantCounter from "@/components/PlantCounter";

export default function HomePage() {
  const { data, isLoading } = useSWR("/api/plants");
  const [showFilter, setShowFilter] = useState(false);
  const [filteredPlants, setFilteredPlants] = useState();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }
  if (data.length === 0) {
    return (
      <StyledMessage>
        <p>There are no plants to admire.</p>
        <p>Why are there no plants?? Who murdered them? 🥲</p>
        <p>
          You can add plants via the + button. Why don&apos;t you go ahead and
          try it out?
        </p>
      </StyledMessage>
    );
  }

  return <PlantList plants={data} />;

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

  function handleClearSubmit(event) {
    setFilteredPlants();
  }

  const filteredPlantList = filteredPlants ?? data;

  return (
    <>
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
          <PlantFilter
            onSubmit={handleFilterSubmit}
            onClear={handleClearSubmit}
            setShowFilter={setShowFilter}
          />
        )}
      </FilterContainer>

      <PlantCounter length={filteredPlantList.length} />

      <PlantList plants={data} />
    </>
  );
}

const FilterContainer = styled.div`
  ${(props) =>
    props.showFilter &&
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
    props.showFilter
      ? css`
          border: none;
        `
      : css`
          border: 1px solid black;
        `};
`;

const StyledMessage = styled.div`
  text-align: center;
  padding: 30px;
`;
