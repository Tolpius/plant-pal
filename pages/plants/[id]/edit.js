import AddForm from "@/components/forms/AddForm";
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

  // return <h2>Editpage functioniert </h2>;

  async function editPlant(plant) {
    const response = await fetch(`/api/plants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plant),
    });

    if (response.ok) {
      router.push(`/plants/${id}`);
    }
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  return (
    <>
      <h2 id="edit-plant">Edit Plant</h2>
      <Link href={`/plants/${id}`} $justifySelf="start">
        back
      </Link>
      <AddForm
        onSubmit={editPlant}
        formName={"edit-plant"}
        defaultData={plant}
      />
    </>
  );
}
