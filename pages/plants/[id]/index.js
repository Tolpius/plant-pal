import BackButton from "@/components/BackButton";
import DeletePopUp from "@/components/DeletePopUp";

import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import { useState } from "react";

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

  const { data: plant, isLoading, error } = useSWR(`/api/plants/${id}`);
  const [showPopUp, setShowPopUp] = useState(false);

  if (isLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !plant) {
    return <h2>Error loading plant data</h2>;
  }

  const seasons = plant.fertiliserSeasons;

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
        src={plant.imageUrl || "/defaultImage.png"}
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
            <StyledCareInfo>{seasonMap[season] ?? season}</StyledCareInfo>
          </li>
        ))}
      </StyledInfoRow>
      <StyledDeleteButton
        onClick={() => {
          setShowPopUp(true);
        }}
      >
        Delete
      </StyledDeleteButton>{" "}
      {showPopUp && (
        <DeletePopUp onDelete={deletePlant} onCancel={setShowPopUp} />
      )}
    </>
  );
}

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
