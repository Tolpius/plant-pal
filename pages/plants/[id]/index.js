import BackButton from "@/components/Backbutton";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";

export default function DetailsPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  const { data: plant, isLoading, error } = useSWR(`/api/plants/${id}`);

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  const seasons = plant.fertiliserSeason;

  return (
    <>
      <BackButton />

      <Image src={plant.imageUrl} alt={plant.name} width={300} height={330} />
      <h3>{plant.name}</h3>
      <p>{plant.botanicalName}</p>
      <p>{plant.description}</p>
      <p>Recommended place for this plant:</p>
      <p>
        {plant.lightNeed === "Partial Shade"
          ? "⛅ Partial Shade"
          : plant.lightNeed === "Bright Indirect Light"
          ? "🌤️ Bright Indirect Light"
          : plant.lightNeed === "Full Sun"
          ? "☀️ Full Sun"
          : plant.lightNeed}
      </p>
      <p>Recommended water amount:</p>
      <p>
        {plant.waterNeed === "Low"
          ? "💧 Low"
          : plant.waterNeed === "Medium"
          ? "💧💧 Medium"
          : plant.waterNeed === "High"
          ? "💧💧💧 High"
          : plant.waterNeed}
      </p>
      <p>Recommended season to fertalise this plant:</p>
      <SeasonList>
        {seasons.map((season) => {
          return (
            <li key={season}>
              <p>
                {season === "Spring"
                  ? "🌸 Spring"
                  : season === "Summer"
                  ? "☀️ Summer"
                  : season === "Autumn"
                  ? "🍂 Autumn"
                  : season === "Winter"
                  ? "❄️ Winter"
                  : season}
              </p>
            </li>
          );
        })}
      </SeasonList>
    </>
  );
}

const SeasonList = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding: 0;
`;
