import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/filter/PlantFilter";
import MessageNoPlants from "@/components/MessageNoPlants";

import SearchPlant from "@/components/search/SearchPlant";
import PlantCounter from "@/components/PlantCounter";

export default function Catalogue() {
  const { data: allPlants, isLoading } = useSWR("/api/plants");
  const [filters, setFilters] = useState({ lightNeed: [], waterNeed: [] });
  const { data: session, status: sessionStatus } = useSession();
  const [plantList, setPlantList] = useState();
  const [hideOwned, setHideOwned] = useState(false);

  if (isLoading || sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!allPlants) {
    return <p>Failed to load plants!</p>;
  }

  if (allPlants.length === 0) {
    return <MessageNoPlants />;
  }

  const filteredPlantList =
    filters.lightNeed.length === 0 && filters.waterNeed.length === 0
      ? !plantList
        ? allPlants
        : plantList
      : (!plantList ? allPlants : plantList).filter((plant) => {
          const matchesLight =
            filters.lightNeed.length === 0 ||
            filters.lightNeed.includes(plant.lightNeed);
          const matchesWater =
            filters.waterNeed.length === 0 ||
            filters.waterNeed.includes(plant.waterNeed);
          return matchesLight && matchesWater;
        });

  function handleSearchResult(searchResult) {
    setPlantList(searchResult);
  }

  function handleHideOwned(event) {
    setHideOwned(event.target.checked);
    console.log(handleHideOwned);
  }

  return (
    <>
      <PlantFilter onFilter={setFilters} handleHideOwned={handleHideOwned} />

      <SearchPlant onSearchResult={handleSearchResult} />
      <PlantList
        hideOwned={hideOwned}
        plants={filteredPlantList}
        session={session}
      />
      <StyledText>Browse to find and select your plants. </StyledText>
      <PlantCounter length={filteredPlantList.length} />
    </>
  );
}

const StyledText = styled.p`
  padding-top: 10px;
  text-align: center;
  font-size: var(--font-size-lg);
`;
