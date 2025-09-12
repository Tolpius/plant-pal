import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import PlantImage from "@/components/PlantImage";
import { GearIcon } from "@phosphor-icons/react";

import BackButton from "@/components/BackButton";
import DeletePopUp from "@/components/DeletePopUp";
import { toast } from "react-toastify";

const lightNeedMap = {
  1: "⛅",
  2: "🌤️",
  3: "☀️",
};

const waterNeedMap = {
  1: "💧",
  2: "💧💧",
  3: "💧💧💧",
};

const seasonMap = {
  spring: "🌸 Spring",
  summer: "☀️ Summer",
  autumn: "🍂 Autumn",
  winter: "❄️ Winter",
};

export default function DetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;
  const from = router.query.from;
  const { data: plant, isLoading, error } = useSWR(`/api/plants/${id}`);
  const [showPopUp, setShowPopUp] = useState(false);
  const { data: session } = useSession();

  if (isLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !plant) {
    return <h2>Error loading plant data</h2>;
  }

  if (plant.error) return <>Error loading plant: {plant.error}</>;
  const seasons = plant.fertiliserSeasons;
  
  async function deletePlant() {
    const response = await fetch(`/api/plants/${id}`, { method: "DELETE" });
    if (response.ok) {
      toast.success("Plant removed.");
      router.push(from);
    } else {
      toast.error("Failed to remove Plant.");
    }
  }

  return (
    <>
      <StyledHeadline>
        <BackButton href={from || undefined} />
        {session?.user?.role === "admin" && (
          <Link href={`/plants/${plant._id}/edit`} aria-label="Edit this plant">
            <GearIcon size={32} color="var(--color-text-base)" />
          </Link>
        )}
      </StyledHeadline>
      <StyledImage
        plant={plant}
        alt={plant.name}
        width={300}
        height={0}
      />
      <NameWrapper>
        <StyledPlantName aria-label={`Common name: ${plant.name}`}>
          {plant.name}
        </StyledPlantName>
        <StyledBotanicalName
          aria-label={`Botanical name: ${plant.botanicalName}`}
        >
          {plant.botanicalName}
        </StyledBotanicalName>
      </NameWrapper>
      <p aria-label="Description of the plant">{plant.description}</p>
      <StyledSection aria-label="Care Information">Care</StyledSection>
      <StyledInfoRow>
        <StyledCareInfo>Plant likes:</StyledCareInfo>
        <StyledCareInfo>
          {lightNeedMap[plant.lightNeed] ?? plant.lightNeed}
        </StyledCareInfo>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledCareInfo>Water need:</StyledCareInfo>
        <StyledCareInfo>
          {waterNeedMap[plant.waterNeed] ?? plant.waterNeed}
        </StyledCareInfo>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledCareInfo>Fertilise in:</StyledCareInfo>
        {seasons.map((season) => (
          <li key={season}>
            <StyledCareInfo>
              {seasonMap[season.toLowerCase()] ?? season}
            </StyledCareInfo>
          </li>
        ))}
      </StyledInfoRow>
      {session?.user?.role === "admin" && (
        <StyledDeleteButton
          onClick={() => {
            setShowPopUp(true);
          }}
          aria-label="Delete this plant"
        >
          Delete
        </StyledDeleteButton>
      )}
      {showPopUp && (
        <DeletePopUp
          onDelete={deletePlant}
          onCancel={() => setShowPopUp(false)}
        />
      )}
    </>
  );
}

const StyledHeadline = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledDeleteButton = styled.button`
  background-color: var(--color-alert);
  color: var(--color-text-white);
  border-radius: var(--radius-sm);
  height: 30px;
  margin-top: 30px;
`;

const StyledImage = styled(PlantImage)`
  width: 100%;
  height: auto;
  display: block;
`;

const NameWrapper = styled.div`
  font-family: var(--font-primary);
  text-align: center;
`;

const StyledPlantName = styled.h3`
  font-size: var(--font-size-xl);
  margin-bottom: 8px;
`;

const StyledBotanicalName = styled.p`
  margin-top: 8px;
  font-style: italic;
  color: var(--color-text-medium);
  font-size: var(--font-size-sm);
`;

const StyledSection = styled.h4`
  font-size: var(--font-size-lg);
`;

const StyledInfoRow = styled.div`
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 8px 0;
  flex-wrap: nowrap;
`;

const StyledCareInfo = styled.p`
  margin: 0;
`;
