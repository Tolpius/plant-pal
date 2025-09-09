import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import BackButton from "@/components/BackButton";
import { useSearchParams } from "next/navigation";

import PlantForm from "@/components/forms/PlantForm";

export default function Add() {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/catalogue";
  async function addPlant(plant) {
    try {
      const response = await fetch(`/api/user/${userId}/owned`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plant),
      });

      if (!response.ok) {
        throw new Error(`Failed to add plant: ${response.statusText}`);
      }

      const newPlant = await response.json();
      if (from === "/admin/catalogue") {
        console.log(newPlant)
        toast.success(`New Plant has been added to catalogue and is marked as ${newPlant.isPublic ? "Public" : "Private"}`);
        router.push("/admin/catalogue");
      } else {
        toast.success(
          "Your plant has been added to your list! An admin will review your plant and might add it to the catalogue."
        );
        router.push("/owned");
      }
    } catch (error) {
      toast.error("Failed to add plant. Please try again.");
    }
  }

  return (
    <>
      <BackButton href={from} />
      <PlantForm onSubmit={addPlant} />
    </>
  );
}
