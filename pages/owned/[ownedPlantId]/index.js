import BackButton from "@/components/BackButton";
import { GearIcon } from "@phosphor-icons/react";
import DeletePopUp from "@/components/DeletePopUp";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { normalisePlantData } from "@/utils/plantHelpers";

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
  const { ownedPlantId } = router.query;
  const { data: session } = useSession();
  const userId = session?.user.id;

  const {
    data: rawPlant,
    isLoading,
    error,
  } = useSWR(
    session ? `/api/user/${session.user.id}/owned/${ownedPlantId}` : null
  );
  const [showPopUp, setShowPopUp] = useState(false);

  if (isLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !rawPlant) {
    return <h2>Error loading plant data</h2>;
  }
  const plant = normalisePlantData(rawPlant);

  async function deletePlant() {
    try {
      const response = await fetch(
        `/api/user/${session.user.id}/owned/${ownedPlantId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to remove plant");

      mutate(
        `/api/user/${userId}/owned`,
        (plants) => plants.filter((plant) => plant._id !== ownedPlantId),
        false
      );

      toast.success("Plant removed.");
      router.push("/owned");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <StyledHeadline>
        <BackButton href="/owned" />
        <h2>{plant.name}</h2>
        {session && (
          <Link
            href={`/owned/${ownedPlantId}/edit`}
            aria-label="Edit this plant"
          >
            <GearIcon size={32} />
          </Link>
        )}
      </StyledHeadline>
      <StyledImage
        src={plant.imageUrl}
        alt={plant.name}
        width={300}
        height={0}
      />
      <NameWrapper>
        <StyledPlantName>{plant.name}</StyledPlantName>
        <StyledBotanicalName>{plant.botanicalName}</StyledBotanicalName>
      </NameWrapper>
      <p>{plant.description}</p>
      <StyledSection>Care</StyledSection>
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
        {plant.fertiliserSeasons &&
          plant.fertiliserSeasons.map((season) => (
            <li key={season}>
              <StyledCareInfo>{seasonMap[season] ?? season}</StyledCareInfo>
            </li>
          ))}
      </StyledInfoRow>

      {plant.nickname && <p>Nickname: {plant.nickname}</p>}
      {plant.location && <p>Location: {plant.location}</p>}
      {plant.acquiredDate && (
        <p>Acquired: {new Date(plant.acquiredDate).toLocaleDateString()}</p>
      )}
      {plant.notes && <p>Notes: {plant.notes}</p>}

      {session && (
        <StyledDeleteButton
          onClick={() => {
            setShowPopUp(true);
          }}
        >
          Remove
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
  background-color: red;
  color: white;
  border-radius: 5px;
  height: 30px;
  margin-top: 30px;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: auto;
  display: block;
`;

const NameWrapper = styled.div`
  font-family: var(--font-headline);
  text-align: center;
`;

const StyledPlantName = styled.h3`
  font-size: var(--fs-xl);
  margin-bottom: 8px;
`;

const StyledBotanicalName = styled.p`
  margin-top: 8px;
  font-style: italic;
  color: var(--color-gray-600);
  font-size: var(--fs-sm);
`;

const StyledSection = styled.h4`
  font-size: var(--fs-lg);
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
