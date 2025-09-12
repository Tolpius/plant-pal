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
    data: plant,
    isLoading,
    error,
  } = useSWR(
    session ? `/api/user/${session.user.id}/owned/${ownedPlantId}` : null
  );
  const [showPopUp, setShowPopUp] = useState(false);

  if (isLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !plant) {
    return <h2>Error loading plant data</h2>;
  }

  async function deletePlant() {
    try {
      mutate(
        `/api/user/${userId}/owned`,
        (plantList) =>
          plantList.filter((plant) => !(plant._id === ownedPlantId)),
        false
      );
      const response = await fetch(
        `/api/user/${session.user.id}/owned/${ownedPlantId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        toast.success("Plant removed.");
        router.push("/owned");
      } else {
        mutate();
        toast.error("Failed to remove Plant.");
      }
    } catch (error) {
      mutate();
      toast.error("Failed to delete plant. Please try again.");
    }
  }

  return (
    <>
      <StyledHeadline>
        <BackButton href="/owned" />
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
        src={
          plant.userImageUrl ||
          plant.cataloguePlantId?.imageUrl ||
          "/defaultImage.png"
        }
        alt={plant.cataloguePlantId?.name}
        width={300}
        height={0}
      />
      <NameWrapper>
        <StyledPlantName>{plant.cataloguePlantId?.name}</StyledPlantName>
        <StyledBotanicalName>
          {plant.cataloguePlantId?.botanicalName}
        </StyledBotanicalName>
      </NameWrapper>
      <p>{plant.cataloguePlantId?.description}</p>
      <StyledSection>Care</StyledSection>
      <StyledInfoRow>
        <StyledCareInfo>Plant likes:</StyledCareInfo>
        <StyledCareInfo>
          {lightNeedMap[plant.cataloguePlantId?.lightNeed] ??
            plant.cataloguePlantId?.lightNeed}
        </StyledCareInfo>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledCareInfo>Water need:</StyledCareInfo>
        <StyledCareInfo>
          {waterNeedMap[plant.cataloguePlantId?.waterNeed] ??
            plant.cataloguePlantId?.waterNeed}
        </StyledCareInfo>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledCareInfo>Fertilise in:</StyledCareInfo>
        {plant.cataloguePlantId?.fertiliserSeasons &&
          plant.cataloguePlantId?.fertiliserSeasons.map((season) => (
            <li key={season}>
              <StyledCareInfo>{seasonMap[season] ?? season}</StyledCareInfo>
            </li>
          ))}
      </StyledInfoRow>
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
