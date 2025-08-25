import PlantForm from "@/components/forms/PlantForm";
import { ArrowCircleLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function EditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  const { data: plant, isLoading, error } = useSWR(`/api/plants/${id}`);

  if (isLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !plant) {
    return <h2>Error loading plant data</h2>;
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <>
      <h2 id="edit-plant">Edit Plant</h2>
      <Link href={`/plants/${id}`} $justifySelf="start" aria-label="Edit plant">
        <ArrowCircleLeftIcon size={32} />
      </Link>
      <PlantForm defaultData={plant} />
    </>
  );
}
