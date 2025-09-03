import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";

import styled from "styled-components";

import MessageNoPlants from "@/components/MessageNoPlants";
import PlantCarousel from "@/components/PlantsCarousel";

export default function HomePage() {
  const { data, isLoading } = useSWR("/api/plants");
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

  return (
    <PageContainer>
      <PlantCarousel plants={data} />
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
`;
