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
    console.log(event);
    setHideOwned(event.target.checked);
  }

  return (
    <>
      <PlantFilter onFilter={setFilters} />
      <input type="checkbox" onClick={handleHideOwned}></input>
      <label>hide owned</label>
      <SearchPlant onSearchResult={handleSearchResult} />
      <PlantList
        hideOwned={hideOwned}
        plants={filteredPlantList}
        session={session}
      />
    </>
  );
}
