import useSWR from "swr";
import { useState } from "react";
import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/filter/PlantFilter";
import PlantCounter from "@/components/PlantCounter";
import { useSession } from "next-auth/react";

export default function Owned() {
  const { data, isLoading } = useSWR("/api/plants");
  const [filters, setFilters] = useState({ lightNeed: [], waterNeed: [] });
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

  const filteredPlantList =
    filters.lightNeed.length === 0 && filters.waterNeed.length === 0
      ? ownedData
      : ownedData.filter((plant) => {
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
