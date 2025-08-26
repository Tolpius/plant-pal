import useSWR from "swr";

import PlantList from "@/components/PlantList";
import { useState } from "react";
import PlantCounter from "@/components/PlantCounter";
import PlantFilter from "@/components/filter/PlantFilter";
import MessageNoPlants from "@/components/MessageNoPlants";

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
    return <MessageNoPlants />;
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
