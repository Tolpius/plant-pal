import useSWR, { mutate } from "swr";
import Card from "./Card";
import styled from "styled-components";

export default function PlantList({
  plants,
  session,
  isOwnedPlantList = false,
  hideOwned,
}) {
  const userId = session?.user.id;
  const swrUrl = session ? `/api/user/${userId}/owned` : null;
  const { data: ownedPlantIds } = useSWR(swrUrl);

  // Später nochmal über useSWR und alles schauen wegen Owned plants und catalogue

  async function handleAddOwned(plantId) {
    if (!session) return;
    //define fetch options for toggle
    const fetchUrl = `/api/user/${userId}/owned/${plantId}`;
    const fetchOptions = {
      method: "POST",
    };

    if (ownedPlantIds) {
      mutate(swrUrl, [...ownedPlantIds, plantId], false);
      await fetch(fetchUrl, fetchOptions);
      mutate(swrUrl);
    }
  }

  return (
    <StyledPlantsList>
      {plants
        .filter((plant) => {
          const isOwned = ownedPlantIds?.some(
            (blossum) => blossum.cataloguePlantId === plant._id
          );
          if (isOwned && hideOwned) return false;
          return true;
        })
        .map((plant) => {
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
