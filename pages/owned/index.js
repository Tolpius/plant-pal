import useSWR from "swr";
import useLocalStorage from "use-local-storage";
import { useState } from "react";
import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/filter/PlantFilter";
import PlantCounter from "@/components/PlantCounter";

export default function Owned() {
  const { data, isLoading } = useSWR("/api/plants");
  const [ownedPlantIds] = useLocalStorage("ownedPlantIds", []);
  const [filteredPlants, setFilteredPlants] = useState();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }
  const ownedData = data.filter((plant) => ownedPlantIds.includes(plant._id));

  if (ownedData.length == 0) {
    return (
      <p>
        You dont own any plants. <br />
        Are you okay?
        <br />
        Go get some Plants!
        <br />
        They are good for you.
      </p>
    );
  }

  const filteredPlantList = filteredPlants ?? ownedData;

  return (
    <>
      <PlantFilter data={ownedData} setFilteredPlants={setFilteredPlants} />
      <PlantCounter length={filteredPlantList.length} />
      <PlantList plants={filteredPlantList} />
    </>
  );
}
