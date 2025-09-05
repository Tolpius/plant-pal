import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/filter/PlantFilter";
import { AddLink } from "@/components/AddLink";

import SearchPlant from "@/components/search/SearchPlant";
import PlantCounter from "@/components/counters/PlantCounter";

export default function Catalogue() {
  const [query, setQuery] = useState(null);
  const { data, isLoading } = useSWR(
    !query ? "/api/plants" : `/api/plants/search/${query}`
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

  function filterPlantList() {
    if (isLoading || !data || !Array.isArray(data)) {
      return [];
    }
    return data.filter((plant) => {
      const isOwned = ownedPlantIds?.some(
        (blossum) => blossum.cataloguePlantId === plant._id
      );
      if (isOwned && filters.hideOwned) return false;
      const matchesLight =
        filters.lightNeed.length === 0 ||
        filters.lightNeed.includes(plant.lightNeed);
      const matchesWater =
        filters.waterNeed.length === 0 ||
        filters.waterNeed.includes(plant.waterNeed);
      return matchesLight && matchesWater;
    });
  }
  const filteredPlantList = filterPlantList();

  const showPlantList = !!filteredPlantList && !isLoading;

  function handleSearchResult(searchQuery) {
    setQuery(searchQuery);
  }

  return (
    <>
      <StyledText>Browse to find and select your plants. </StyledText>
      <PlantFilter
        onFilter={setFilters}
        withOwnedFilter={true}
        filterPlantList={filterPlantList}
      />
      <AddLink href="/add">Didnt find your Plant? Create your own!</AddLink>

      <SearchPlant onSearch={handleSearchResult} />
      {isLoading && <p>is loading...</p>}
      {showPlantList && (
        <>
      <PlantCounter length={filteredPlantList.length} />
          <PlantList plants={filteredPlantList} session={session} />
        </>
      )}
    </>
  );
}

const StyledText = styled.p`
  padding-top: 10px;
  text-align: center;
  font-size: var(--font-size-lg);
`;
