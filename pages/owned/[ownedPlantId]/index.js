import BackButton from "@/components/BackButton";
import {
  CaretCircleDownIcon,
  CaretCircleUpIcon,
  GearIcon,
} from "@phosphor-icons/react";
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

const dummyData = {
  persName: "My Nickname",
  persLocation: "Living Room",
  persNotes: "Lorem",
  persDate: "14.09.2025",
  /* persImage: "Image" */
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
  const [isExtendedPersonalNotes, setIsExtendedPersonalNotes] = useState(false);
  const [isExtendedGeneralInfo, setIsExtendedGeneralInfo] = useState(true);

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
      mutate();
      toast.error("Failed to delete plant. Please try again.");
    }
  }

  /*   const date1 = new Date('9/13/2025');
const date2 = new Date('9/15/2025');
const birthday = new Date();
const Day = birthday.getDate();
const Month = birthday.getMonth()
const Year = birthday.getFullYear()
const today = `${Day}.${Month}.${Year}`
const diffTime = Math.abs(date2 - date1);
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
console.log("today:",today);
console.log(Month + " days") */
  return (
    <>
      <StyledHeadline>
        <BackButton href="/owned"  />
        <h2>{plant.nickname || plant.name}</h2> {/* !!!! */}
        {dummyData.persName ? (
          <StyledHeadlinePlantName>{dummyData.persName}</StyledHeadlinePlantName>
        ) : (
          <StyledHeadlinePlantName>{plant.name}</StyledHeadlinePlantName>
        )}
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
        <p>Species</p>
        <p>Botanical Name</p>
      </NameWrapper>
      {dummyData.persImage ? (
        dummyData.persImage
      ) : (
        <StyledImage
          src={plant.imageUrl || "/defaultImage.png"}
          alt={plant.name}
          width={300}
          height={0}
        />
      )}
      <Wrapper>
        {isExtendedGeneralInfo ? (
          <GeneralInformationWrapper>
            <StyledExtendedWrapper>
              <StyledSectionHeadline>General Information</StyledSectionHeadline>
              <ExtendingButton onClick={() => setIsExtendedGeneralInfo(false)}>
                <CaretCircleUpIcon size={28} />
              </ExtendingButton>
            </StyledExtendedWrapper>
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
                    <StyledCareInfo>
                      {seasonMap[season] ?? season}
                    </StyledCareInfo>
                  </li>
                ))}
            </StyledInfoRow>
          </GeneralInformationWrapper>
        ) : (
          <StyledExtendedWrapper>
            <StyledSectionHeadline>General Information</StyledSectionHeadline>
            <ExtendingButton onClick={() => setIsExtendedGeneralInfo(true)}>
              <CaretCircleDownIcon size={28} />
            </ExtendingButton>
          </StyledExtendedWrapper>
        )}
      </Wrapper>
      <Wrapper>
        {isExtendedPersonalNotes ? (
          <GeneralInformationWrapper>
            <StyledExtendedWrapper>
              <StyledSectionHeadline>
                Personal Information
              </StyledSectionHeadline>
              <ExtendingButton
                onClick={() => setIsExtendedPersonalNotes(false)}
              >
                <CaretCircleUpIcon size={28} />
              </ExtendingButton>
            </StyledExtendedWrapper>
            <StyledInfoRow>
              <StyledPlantName>{dummyData.persName}</StyledPlantName>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledCareInfo>{dummyData.persLocation}</StyledCareInfo>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledCareInfo>{dummyData.persDate}</StyledCareInfo>
            </StyledInfoRow>
            <StyledInfoRow>
              <StyledCareInfo>{dummyData.persNotes}</StyledCareInfo>
            </StyledInfoRow>
          </GeneralInformationWrapper>
        ) : (
          <StyledExtendedWrapper>
            <StyledSectionHeadline>Personal Information</StyledSectionHeadline>
            <ExtendingButton onClick={() => setIsExtendedPersonalNotes(true)}>
              <CaretCircleDownIcon size={28} />
            </ExtendingButton>
          </StyledExtendedWrapper>
        )}
      </Wrapper>

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

const StyledHeadlinePlantName = styled.h2``

const StyledSectionHeadline = styled.h3``;

const StyledExtendedWrapper = styled.div`
  display: flex;
`;

const ExtendingButton = styled.button`
  border: none;
  background-color: var(--color-secondary);
`;

const Wrapper = styled.div`
  border: 1px solid var(--color-neutral-base);
  padding: 10px;
  border-radius: var(--radius-bg-md);
  color: var(--color-text-base);
`;
const GeneralInformationWrapper = styled.div``;

const StyledHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--color-text-base);
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  font-family: var(--font-headline);
  text-align: center;
  color: var(--color-text-base);
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
