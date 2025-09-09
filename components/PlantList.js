import useSWR, { mutate } from "swr";
import Card from "./Card";
import styled from "styled-components";

export default function PlantList({
  plants,
  session,
  isOwnedPlantList = false,
}) {
  const userId = session?.user.id;
  const swrUrl = session ? `/api/user/${userId}/owned` : null;
  const { data: ownedPlantIds } = useSWR(swrUrl);

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
