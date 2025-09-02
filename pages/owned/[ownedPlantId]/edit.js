import PlantForm from "@/components/forms/PlantForm";
import { ArrowCircleLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/react";

export default function EditPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isReady } = router;
  const { ownedPlantId } = router.query;
  const userId = session?.user.id;
  const {
    data: ownedPlant,
    isLoading,
    error,
  } = useSWR(`/api/user/${userId}/owned/${ownedPlantId}`);

  if (isLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !ownedPlant) {
    return <h2>Error loading plant data</h2>;
  }

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  async function editPlant(ownedPlant) {
    try {
      const response = await fetch(
        `/api/user/${userId}/owned/${ownedPlantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ownedPlant),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to edit plant: ${response.statusText}`);
      }

      const updatedPlant = await response.json();
      console.log("Plant edited successfully:", updatedPlant);

      router.push(`/owned/${ownedPlantId}`);
    } catch (error) {
      console.error("Error editing plant:", error);
      alert("Failed to edit plant. Please try again.");
    }
  }

  return (
    <>
      <h2>Edit Your Plant</h2>
      <Link
        href={`/owned/${ownedPlantId}`}
        $justifySelf="start"
        aria-label="Edit plant"
      >
        <ArrowCircleLeftIcon size={32} />
      </Link>
      <PlantForm defaultData={ownedPlant} onSubmit={editPlant} />
    </>
  );
}
