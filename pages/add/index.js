import PlantForm from "@/components/forms/PlantForm";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Add() {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;
  async function addPlant(plant) {
    try {
      console.log(session)
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
      console.log("Plant added successfully:", newPlant);

      router.push(`/owned`);
    } catch (error) {
      console.error("Error adding plant:", error);
      alert("Failed to add plant. Please try again.");
    }
  }

  if (!session) {
    return <>loading....</>;
  }

  return <PlantForm onSubmit={addPlant} />;
}
