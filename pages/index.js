import useSWR from "swr";
import styled, { css } from "styled-components";

import PlantList from "@/components/PlantList";
import { useState } from "react";
import PlantCounter from "@/components/PlantCounter";
import PlantFilter from "@/components/PlantFilter";

export default function HomePage() {
  const { data, isLoading } = useSWR("/api/plants");
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

  const filteredPlantList = filteredPlants ?? data;

  return (
    <>
      <PlantFilter data={data} setFilteredPlants={setFilteredPlants} />
      <PlantCounter length={filteredPlantList.length} />
      <PlantList plants={filteredPlantList} />
    </>
  );
}

const StyledMessage = styled.div`
  text-align: center;
  padding: 30px;
`;
