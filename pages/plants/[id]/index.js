import Image from "next/image";
import { useRouter } from "next/router";
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
      <p>{plant.name}</p>
      <p>{plant.botanicalName}</p>
      <Image src={plant.imageUrl} alt={plant.name} width={300} height={0} />
      <p>{plant.description}</p>
      <p>{plant.lightNeed}</p>
      <p>{plant.waterNeed}</p>
      <ul>
        {seasons.map((season) => {
          return (
            <li key={season}>
              <p>{season}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
