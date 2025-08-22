import BackButton from "@/components/BackButton";
import DeletePopUp from "@/components/DeletePopUp";

import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import { useState } from "react";

export default function DetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  const { data: plant, isLoading, error } = useSWR(`/api/plants/${id}`);
  const [showPopUp, setShowPopUp] = useState(false);

  if (!isReady || isLoading || error || !plant) return <h2>Loading...</h2>;

  const seasons = plant.fertiliserSeason;

  async function deletePlant() {
    const response = await fetch(`/api/plants/${id}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/");
    }
  }

  return (
    <>
      <BackButton />
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
      <h4>Care</h4>
      <StyledInfoRow>
        <StyledCareInfo>Plant likes:</StyledCareInfo>
        <StyledCareInfo>
          {plant.lightNeed === "1"
            ? "⛅ "
            : plant.lightNeed === "2"
            ? "🌤️  "
            : plant.lightNeed === "3"
            ? "☀️ "
            : plant.lightNeed}
        </StyledCareInfo>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledCareInfo>Water need:</StyledCareInfo>
        <StyledCareInfo>
          {plant.waterNeed === "1"
            ? "💧 "
            : plant.waterNeed === "2"
            ? "💧💧 "
            : plant.waterNeed === "3"
            ? "💧💧💧 "
            : plant.waterNeed}
        </StyledCareInfo>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledCareInfo>Fertilise in:</StyledCareInfo>

        {seasons.map((season) => {
          return (
            <li key={season}>
              <StyledCareInfo>
                {season === "spring"
                  ? "🌸 Spring"
                  : season === "summer"
                  ? "☀️ Summer"
                  : season === "autumn"
                  ? "🍂 Autumn"
                  : season === "winter"
                  ? "❄️ Winter"
                  : season}
              </StyledCareInfo>
            </li>
          );
        })}
      </StyledInfoRow>
      <StyledDeleteButton
        onClick={() => {
          setShowPopUp(true);
        }}
      >
        Delete
      </StyledDeleteButton>{" "}
      {showPopUp && (
        <TestOverlay>
          <DeletePopUp deletePlant={deletePlant} setShowPopUp={setShowPopUp} />
        </TestOverlay>
      )}
    </>
  );
}

const TestOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
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
  text-align: center;
`;

const StyledPlantName = styled.h3`
  margin-bottom: 8px;
`;

const StyledBotanicalName = styled.p`
  margin-top: 8px;
  font-style: italic;
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
