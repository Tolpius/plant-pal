import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import PlantList from "@/components/PlantList";
import PlantFilter from "@/components/admin/filter/PlantFilter";
import AddLink from "@/components/AddLink";
import MessageNoPlants from "@/components/MessageNoPlants";

export default function AdminCatalogue() {
  const { data, isLoading } = useSWR("/api/admin/catalogue");
  const [filter, setFilter] = useState({ isPublic: "all" });
  const { data: session, status: sessionStatus } = useSession();

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
    filter.isPublic === "all"
      ? data
      : data.filter((plant) => plant.isPublic === filter.isPublic);

  return (
    <>
      <StyledText>Browse to find and select your plants. </StyledText>
      <PlantFilter onFilter={setFilter} />
      <AddLink />
      <PlantList plants={filteredPlantList} session={session} />
    </>
  );
}

const StyledText = styled.p`
  padding-top: 10px;
  text-align: center;
  font-size: var(--font-size-lg);
`;
