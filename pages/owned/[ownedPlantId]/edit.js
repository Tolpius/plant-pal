import { ArrowCircleLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import EditOwnedForm from "@/components/forms/EditOwnedForm";

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
    mutate,
  } = useSWR(
    userId && ownedPlantId ? `/api/user/${userId}/owned/${ownedPlantId}` : null
  );

  if (isLoading || !isReady) {
    return <h2>Loading...</h2>;
  }
  if (error || !ownedPlant) {
    return <h2>Error loading plant data</h2>;
  }

  async function editPlant(newPlant) {
    try {
      mutate(newPlant, false);
      const response = await fetch(
        `/api/user/${userId}/owned/${ownedPlantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlant),
        }
      );

      if (!response.ok) {
        mutate();
        toast.error("Failed to edit Plant.");
        return;
      }

      const updatedPlant = await response.json();
      toast.success("Plant saved.");
      console.log("Plant edited successfully:", updatedPlant);

      router.push(`/owned/${ownedPlantId}`);
    } catch (error) {
      mutate();
      console.error("Error editing plant:", error);
      toast.error("Failed to edit plant. Please try again.");
    }
  }

  return (
    <>
      <Link
        href={`/owned/${ownedPlantId}`}
        $justifySelf="start"
        aria-label="Edit plant"
      >
        <ArrowCircleLeftIcon size={32} />
      </Link>
      <EditOwnedForm defaultData={ownedPlant} onSubmit={editPlant} />
    </>
  );
}
