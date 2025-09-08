import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import PlantForm from "@/components/forms/PlantForm";

export default function Add() {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;

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
      toast(
        "Your plant has been added to your list! An admin will review your plant and might add it to the catalogue."
      );
      router.push(`/owned`);
    } catch (error) {
      alert("Failed to add plant. Please try again.");
    }
  }

  return <PlantForm onSubmit={addPlant} />;
}
