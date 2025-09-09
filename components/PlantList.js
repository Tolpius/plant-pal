import useSWR, { mutate } from "swr";
import Card from "./Card";
import styled from "styled-components";
import { toast } from "react-toastify";

export default function PlantList({
  plants,
  session,
  isOwnedPlantList = false,
}) {
  const userId = session?.user.id;
  const swrUrl = session ? `/api/user/${userId}/owned` : null;
  const { data: ownedPlantIds, mutate } = useSWR(swrUrl);

  async function handleAddOwned(plantId) {
    if (!session) return;
    //define fetch options for toggle
    const fetchUrl = `/api/user/${userId}/owned/${plantId}`;
    const fetchOptions = {
      method: "POST",
    };

    if (ownedPlantIds) {
      mutate([...ownedPlantIds, plantId], false);
      try {
        const response = await fetch(fetchUrl, fetchOptions);
        if (!response.ok) toast.error("Error: Failed to add Plant.");
        else toast.success("Plant added.");
        mutate();
      } catch (error) {
        toast.error("Error: Faild to add Plant.");
        throw error;
      }
    }
  }

  return (
    <StyledPlantsList>
      {plants.map((plant) => {
        return (
          <li key={plant._id}>
            <Card
              session={session}
              plant={plant}
              onAddOwned={() => handleAddOwned(plant._id.toString())}
              isOwnedPlantList={isOwnedPlantList}
            />
          </li>
        );
      })}
    </StyledPlantsList>
  );
}

const StyledPlantsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 2fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
`;
