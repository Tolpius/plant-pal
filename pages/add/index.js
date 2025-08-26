import PlantForm from "@/components/forms/PlantForm";

export default function Add() {
    async function addPlant(plant) {
    try {
      const response = await fetch("/api/plants", {
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

      router.push(`/`);
    } catch (error) {
      console.error("Error adding plant:", error);
      alert("Failed to add plant. Please try again.");
    }
  }

  return <PlantForm onSubmit={addPlant} />;
}
