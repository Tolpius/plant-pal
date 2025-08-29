import useSWR from "swr";

import PlantList from "@/components/PlantList";
import { useState } from "react";
import PlantCounter from "@/components/PlantCounter";
import PlantFilter from "@/components/filter/PlantFilter";
import MessageNoPlants from "@/components/MessageNoPlants";
import FunFactDisplay from "@/components/FunFact";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data, isLoading } = useSWR("/api/plants");
  const [filters, setFilters] = useState({ lightNeed: [], waterNeed: [] });
  const {data: session, status: sessionStatus} = useSession();

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
  return (
    <>
      <PlantFilter onFilter={setFilters} />
      <PlantCounter length={filteredPlantList.length} />
      <PlantList plants={filteredPlantList} session={session} />
    </>
  );
}
