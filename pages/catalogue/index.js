import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/filter/PlantFilter";
import MessageNoPlants from "@/components/MessageNoPlants";

import SearchPlant from "@/components/search/SearchPlant";
import PlantCounter from "@/components/counters/PlantCounter";

export default function Catalogue() {
  const [query, setQuery] = useState(null);
  const { data, isLoading } = useSWR(
    `/api/plants${query ? "/search?query=" + query : ""}`
  );
  const [filters, setFilters] = useState({
    lightNeed: [],
    waterNeed: [],
    hideOwned: false,
  });
  const { data: session, status: sessionStatus } = useSession();

  const userId = session?.user.id;
  const swrUrl = session ? `/api/user/${userId}/owned` : null;
  const { data: ownedPlantIds } = useSWR(swrUrl);

  if (isLoading || sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }

  if (data.length === 0) {
    return <MessageNoPlants />;
  }

  const filteredPlantList =
    filters.lightNeed.length === 0 && filters.waterNeed.length === 0
      ? data
      : data.filter((plant) => {
          const matchesLight =
            filters.lightNeed.length === 0 ||
            filters.lightNeed.includes(plant.lightNeed);
          const matchesWater =
            filters.waterNeed.length === 0 ||
            filters.waterNeed.includes(plant.waterNeed);
          return matchesLight && matchesWater;
        });
  const fullyFilteredPlantList = filteredPlantList.filter((plant) => {
    const isOwned = ownedPlantIds?.some(
      (blossum) => blossum.cataloguePlantId === plant._id
    );
    if (isOwned && filters.hideOwned) return false;
    return true;
  });

  function handleSearchResult(searchQuery) {
    setQuery(searchQuery);
  }

  function handleFilterReset() {
    setQuery("");
  }

  return (
    <>
      <StyledText>Browse to find and select your plants. </StyledText>
      <PlantFilter
        onFilter={setFilters}
        onReset={handleFilterReset}
        withOwnedFilter={true}
      />

      <SearchPlant onSearch={handleSearchResult} />
      <PlantCounter length={fullyFilteredPlantList.length} />
      <PlantList plants={fullyFilteredPlantList} session={session} />
    </>
  );
}

const StyledText = styled.p`
  padding-top: 10px;
  text-align: center;
  font-size: var(--font-size-lg);
`;
