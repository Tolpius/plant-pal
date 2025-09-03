import useSWR from "swr";

import PlantList from "@/components/PlantList";
import { useState } from "react";

import PlantFilter from "@/components/filter/PlantFilter";
import MessageNoPlants from "@/components/MessageNoPlants";
import { useSession } from "next-auth/react";
import SearchPlant from "@/components/search/SearchPlant";

export default function Catalogue() {
  const { data: allPlants, isLoading } = useSWR("/api/plants");
  const [filters, setFilters] = useState({ lightNeed: [], waterNeed: [] });
  const { data: session, status: sessionStatus } = useSession();
  const [plantList, setPlantList] = useState(allPlants);

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
      ? plantList
      : plantList.filter((plant) => {
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

  return (
    <>
      <PlantFilter onFilter={setFilters} />
      <SearchPlant onSearchResult={handleSearchResult} />
      <PlantList plants={filteredPlantList} session={session} />
    </>
  );
}
