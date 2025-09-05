import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function DarkMode() {
    const { data: session } = useSession();
    console.log('session: ', session);
    
  /* if clicked toggle isDarkmode
    if is Dakr Mode is true set body dark(add a new class) on body dark
    dark on body uses new variables which are dark (duh!) */
   //WHERE DO I GET THE USER ID FROM? not query, thats the slug of whereever we are at..
//const { data: user, isLoading, error } = useSWR(`/api/user/${userId}`);
  async function toggleDarkMode(user) {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit plant: ${response.statusText}`);
      }

      const updatedPlant = await response.json();
      console.log("Plant edited successfully:", updatedPlant);

      router.push(`/plants/${id}`);
    } catch (error) {
      console.error("Error editing plant:", error);
      alert("Failed to edit plant. Please try again.");
    }
  }
}
