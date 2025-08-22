import BackButton from "@/components/BackButton";
import { ST } from "next/dist/shared/lib/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";

export default function DetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  const { data: plant, isLoading, error } = useSWR(`/api/plants/${id}`);

  if (!isReady || isLoading || error || !plant) return <h2>Loading...</h2>;

  const seasons = plant.fertiliserSeason;

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
          {plant.lightNeed === "Partial Shade"
            ? "⛅ "
            : plant.lightNeed === "Bright Indirect Light"
            ? "🌤️  "
            : plant.lightNeed === "Full Sun"
            ? "☀️ "
            : plant.lightNeed}
        </StyledCareInfo>
      </StyledInfoRow>
      <StyledInfoRow>
        <StyledCareInfo>Water need:</StyledCareInfo>
        <StyledCareInfo>
          {plant.waterNeed === "Low"
            ? "💧 "
            : plant.waterNeed === "Medium"
            ? "💧💧 "
            : plant.waterNeed === "High"
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
                {season === "Spring"
                  ? "🌸 Spring"
                  : season === "Summer"
                  ? "☀️ Summer"
                  : season === "Autumn"
                  ? "🍂 Autumn"
                  : season === "Winter"
                  ? "❄️ Winter"
                  : season}
              </StyledCareInfo>
            </li>
          );
        })}
      </StyledInfoRow>
    </>
  );
}

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
