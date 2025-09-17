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

  return (
    <>
      <StyledHeadline>
        <BackButton href="/owned" />
        <StyledHeadlinePlantName>
          {plant.nickname || plant.name}
        </StyledHeadlinePlantName>
      </StyledHeadline>

      <NameWrapper>
        <StyledNameInfoWrapper>
          <StyledPlantName>{plant.name}</StyledPlantName>
          <StyledBotanicalName>{plant.botanicalName}</StyledBotanicalName>
        </StyledNameInfoWrapper>
        <StyledNameInfoWrapper>
          <StyledCursive>Species</StyledCursive>
          <StyledCursive>Botanical Name</StyledCursive>
        </StyledNameInfoWrapper>
      </NameWrapper>
      <StyledImageWrapper>
        <StyledImage
          src={plant.imageUrl}
          alt={plant.name}
          width={300}
          height={0}
        />
      </StyledImageWrapper>
      <Wrapper>
        {isExtendedGeneralInfo ? (
          <GeneralInformationWrapper>
            <StyledExtendedWrapper>
              <ExtendingButton onClick={() => setIsExtendedGeneralInfo(false)}>
                <CaretCircleUpIcon size={28} />
              </ExtendingButton>
              <h3>General Information</h3>
            </StyledExtendedWrapper>
            <StyledInfoWrapper>
              <p>{plant.description}</p>
              <StyledSection>Care:</StyledSection>
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
            </StyledInfoWrapper>
          </GeneralInformationWrapper>
        ) : (
          <StyledExtendedWrapper>
            <ExtendingButton onClick={() => setIsExtendedGeneralInfo(true)}>
              <CaretCircleDownIcon size={28} />
            </ExtendingButton>
            <h3>General Information</h3>
          </StyledExtendedWrapper>
        )}
      </Wrapper>
      <Wrapper>
        {isExtendedPersonalNotes ? (
          <GeneralInformationWrapper>
            <StyledExtendedWrapper>
              <ExtendingButton
                onClick={() => setIsExtendedPersonalNotes(false)}
              >
                <CaretCircleUpIcon size={28} />
              </ExtendingButton>
              <h3>Personal Information</h3>

              {session && (
                <StyledEditLink
                  href={`/owned/${ownedPlantId}/edit`}
                  aria-label="Edit this plant"
                >
                  <GearIcon size={28} />
                </StyledEditLink>
              )}
            </StyledExtendedWrapper>
            <StyledInfoWrapper>
              <StyledInfoRow>
                {!plant.nickname &&
                  !plant.location &&
                  !plant.acquiredDate &&
                  !plant.notes && (
                    <p>
                      You do not have any personal information. You can edit the
                      plant and add some.
                    </p>
                  )}
                <h4>{plant.nickname && <p>Nickname: {plant.nickname}</p>}</h4>
              </StyledInfoRow>
              <StyledInfoRow>
                <StyledCareInfo>
                  {plant.location && <p>Location: {plant.location}</p>}
                </StyledCareInfo>
              </StyledInfoRow>
              <StyledInfoRow>
                <StyledCareInfo>
                  {plant.acquiredDate && (
                    <p>
                      {`Acquired: 
                    ${new Date(plant.acquiredDate).toLocaleDateString()}`}
                    </p>
                  )}
                </StyledCareInfo>
              </StyledInfoRow>
              <StyledInfoRow>
                <StyledCareInfo>
                  {plant.notes && <p>Notes: {plant.notes}</p>}
                </StyledCareInfo>
              </StyledInfoRow>
            </StyledInfoWrapper>
          </GeneralInformationWrapper>
        ) : (
          <StyledExtendedWrapper>
            <ExtendingButton onClick={() => setIsExtendedPersonalNotes(true)}>
              <CaretCircleDownIcon size={28} />
            </ExtendingButton>
            <h3>Personal Information</h3>
          </StyledExtendedWrapper>
        )}
      </Wrapper>

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

const StyledInfoWrapper = styled.div`
  padding: 0 8px;
`;

const StyledImageWrapper = styled.div`
  padding-bottom: 8px;
`;

const StyledNameInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
`;

const StyledCursive = styled.p`
  font-style: italic;
  font-size: var(--font-size-sm);
`;

const StyledHeadlinePlantName = styled.h2`
  justify-self: center;
`;

const StyledEditLink = styled(Link)`
  color: var(--color-neutral-base);
`;

const StyledExtendedWrapper = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
`;

const ExtendingButton = styled.button`
  color: var(--color-neutral-base);
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
  display: grid;
  grid-template-columns: 40px 2fr 40px;
  padding-top: 8px;
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

const StyledSection = styled.p`
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
