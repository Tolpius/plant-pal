import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/filter/PlantFilter";
import PlantCounter from "@/components/PlantCounter";

export default function Owned() {
  const { data: plantList, isPlantsLoading } = useSWR("/api/plants");
  const { data: session, status: sessionStatus } = useSession();

  const userId = session?.user.id;
  const swrUrl = session ? `/api/user/${userId}/owned` : null;

  const [filters, setFilters] = useState({ lightNeed: [], waterNeed: [] });
  const { data: ownedPlantIds, isLoading: isOwnedPlantIdsLoading } =
    useSWR(swrUrl);

  if (
    (isPlantsLoading || sessionStatus === "loading", isOwnedPlantIdsLoading)
  ) {
    return <p>Loading...</p>;
  }

  if (!plantList || !ownedPlantIds) {
    return <p>Failed to load plantList!</p>;
  }

  const ownedData = ownedPlantIds
    ? plantList.filter((plant) => ownedPlantIds.includes(plant._id))
    : [];

  if (ownedData.length == 0) {
    return (
      <TextWrapper>
        <StyledText>You dont own any plants.</StyledText>
        <StyledText>Are you okay?</StyledText>
        <StyledText>Go get some Plants!</StyledText>
        <StyledText>They are good for you.</StyledText>
      </TextWrapper>
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
      <StyledText>My owned Plants</StyledText>
      <PlantFilter onFilter={setFilters} />
      <PlantCounter length={filteredPlantList.length} />
      <PlantList plants={filteredPlantList} session={session} />
    </>
  );
}

const StyledText = styled.p`
  padding-top: 10px;
  text-align: center;
  font-size: var(--font-size-xl);
`;

const TextWrapper = styled.div`
  padding: 50px 0;
`;
