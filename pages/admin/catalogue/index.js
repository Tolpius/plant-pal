import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";
import PlantList from "@/components/admin/AdminPlantList";
import PlantFilter from "@/components/admin/filter/PlantFilter";
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
      <StyledHeadline>Browse to find and select your plants. </StyledHeadline>
      <PlantFilter onFilter={setFilter} />
      <AddLink href = "/"/>
      <PlantList plants={filteredPlantList} session={session} />
    </>
  );
}

const StyledHeadline = styled.h2`
  padding-top: 10px;
  text-align: center;
  font-size: var(--font-size-lg);
`;

const AddLink = styled(Link)`
  border: 1px solid #000000;
  border-radius: 10px;
  background: var(--color-green-300);
  text-decoration: none;
  text-align: center;
  padding: var(--pd-sm);
  &:visited {
    color: inherit;
  }
`;