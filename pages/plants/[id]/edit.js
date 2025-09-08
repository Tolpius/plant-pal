import { useRouter } from "next/router";
import useSWR from "swr";
import BackButton from "@/components/BackButton";
import { useSearchParams } from "next/navigation";

import PlantForm from "@/components/forms/PlantForm";
import { toast } from "react-toastify";

export default function EditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || `/plants/${id}`;
  const fromfrom = searchParams.get("fromfrom") || `/`;
  const { data: plant, isLoading, error } = useSWR(`/api/plants/${id}`);

  if (isLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !plant) {
    return <h2>Error loading plant data</h2>;
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  async function editPlant(plant) {
    try {
      const response = await fetch(`/api/plants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plant),
      });

      if (!response.ok) {
        toast.error("ERROR: Failed. Please try again.");

        return;
      }

      const updatedPlant = await response.json();
      console.log("Plant edited successfully:", updatedPlant);

      router.push({
        pathname: from,
        query: { from: fromfrom },
      });
      toast.success("Plant saved");
    } catch (error) {
      console.error("Error editing plant:", error);
      toast.error("Failed to edit plant. Please try again.");
    }
  }

  return (
    <>
      <h2 id="edit-plant">Edit Plant</h2>
      <BackButton
        href={{
          pathname: from,
          query: { from: fromfrom },
        }}
        aria-label="Go back"
      />
      <PlantForm defaultData={plant} onSubmit={editPlant} />
    </>
  );
}
