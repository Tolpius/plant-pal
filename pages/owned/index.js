import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/filter/PlantFilter";
import PlantCounter from "@/components/counters/PlantCounter";
import { normalisePlantData } from "@/utils/plantHelpers";

export default function Owned() {
  const { data: session, status: sessionStatus } = useSession();
  const [filters, setFilters] = useState({ lightNeed: [], waterNeed: [] });
  const userId = session?.user.id;
  const { data: plantList, isPlantsLoading } = useSWR(
    session ? `/api/user/${userId}/owned` : null
  );

  if (isPlantsLoading || sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!plantList) {
    return <p>Failed to load plantList!</p>;
  }

  if (plantList.length == 0) {
    return (
      <TextWrapper>
        <StyledText>You dont own any plants.</StyledText>
        <StyledText>Are you okay?</StyledText>
        <StyledText>Go get some Plants!</StyledText>
        <StyledText>They are good for you.</StyledText>
      </TextWrapper>
    );
  }

  console.log("plantList:", plantList);
  console.log("type:", typeof plantList);
  console.log("isArray:", Array.isArray(plantList));

  const normalisedList = plantList.map((plant) =>
    normalisePlantData(plant, true)
  );

  const filteredPlantList =
    filters.lightNeed.length === 0 && filters.waterNeed.length === 0
      ? normalisedList
      : normalisedList.filter((plant) => {
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
      <PlantFilter
        onFilter={setFilters}
        withOwnedFilter={false}
        values={filters}
      />
      <PlantCounter length={filteredPlantList.length} />
      <PlantList
        plants={filteredPlantList}
        session={session}
        isOwnedPlantList={true}
      />
    </>
  );
}

const StyledText = styled.p`
  color: var(--color-neutral-base);
  padding-top: var(--padding-bg-sm);
  text-align: center;
  font-size: var(--font-size-xl);
`;

const TextWrapper = styled.div`
  padding: 50px 0;
`;
