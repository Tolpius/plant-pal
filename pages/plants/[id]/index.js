import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styled from "styled-components";
import PlantImage from "@/components/PlantImage";
import OwnedButton from "@/components/OwnedButton";
import OwnedCounter from "@/components/counters/OwnedCounter";
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
  const {
    data: count,
    isLoading: countOwnedIsLoading,
    mutate: mutateCount,
  } = useSWR(`/api/plants/${plant?._id}/countowned`);
  const [showPopUp, setShowPopUp] = useState(false);
  const { data: session } = useSession();

  if (isLoading || countOwnedIsLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !plant) {
    return <h2>Error loading plant data</h2>;
  }

  if (plant.error) return <>Error loading plant: {plant.error}</>;
  const seasons = plant.fertiliserSeasons;

  async function handleAddOwned() {
    if (!session || !plant._id) return;

    const previousCount = count;
    mutateCount(previousCount + 1, false);

    try {
      const fetchUrl = `/api/user/${session.user.id}/owned/${plant._id}`;
      const fetchOptions = {
        method: "POST",
      };
      const response = await fetch(fetchUrl, fetchOptions);
      if (!response.ok) {
        toast.error("Error: Failed to add Plant.");
      } else toast.success("Plant added.");
    } catch (error) {
      toast.error("Error: Faild to add Plant.");
    } finally {
      mutateCount();
    }
  }

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
        <StyledHeadlinePlantName>
          {plant.nickname || plant.name}
        </StyledHeadlinePlantName>
        {session?.user?.role === "admin" && (
          <Link href={`/plants/${plant._id}/edit`} aria-label="Edit this plant">
            <GearIcon size={32} color="var(--color-text-base)" />
          </Link>
        )}
      </StyledHeadline>
      <NameWrapper>
        <StyledNameInfoWrapper>
          <StyledPlantName aria-label={`Common name: ${plant.name}`}>
            {plant.name}
          </StyledPlantName>
          <StyledBotanicalName
            aria-label={`Botanical name: ${plant.botanicalName}`}
          >
            {plant.botanicalName}
          </StyledBotanicalName>
        </StyledNameInfoWrapper>
        <StyledNameInfoWrapper>
          <StyledCursive>Species</StyledCursive>
          <StyledCursive>Botanical Name</StyledCursive>
        </StyledNameInfoWrapper>
      </NameWrapper>

      <StyledImage
        plant={plant}
        alt={plant.name}
        width={300}
        height={0}
      />

      <Wrapper>
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
      </Wrapper>
      <OwnedCounter length={count || 0} />
      <OwnedButton
        onAddOwned={handleAddOwned}
        aria-label={`Add plant to owned for ${plant.name}`}
      />

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

const StyledHeadlinePlantName = styled.h2`
  justify-self: center;
`;

const StyledNameInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  color: var(--color-neutral-base);
`;

const StyledCursive = styled.p`
  font-style: italic;
  font-size: var(--font-size-sm);
`;

const StyledHeadline = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr 40px;
  padding-top: 8px;
  color: var(--color-text-base);
`;

const StyledDeleteButton = styled.button`
  background-color: var(--color-alert);
  color: var(--color-text-white);
  border-radius: var(--radius-sm);
  height: 30px;
`;

const StyledImage = styled(PlantImage)`
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--radius-bg-md);
`;

const NameWrapper = styled.div`
  padding: 8px 0;
  text-align: center;
  color: var(--color-text-base);
`;

const StyledPlantName = styled.h3`
  font-size: var(--font-size-lg);
`;

const StyledBotanicalName = styled.p`
  color: var(--color-neutral-base);
  font-size: var(--font-size-md);
`;

const Wrapper = styled.div`
  border: 1px solid var(--color-neutral-base);
  padding: 10px;
  border-radius: var(--radius-bg-md);
  color: var(--color-text-base);
  margin-bottom: 30px;
`;

const StyledSection = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: bold;
  padding-top: 12px;
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
