import Card from "./Card";
import styled from "styled-components";
import useSWR, { mutate } from "swr";

export default function PlantList({ plants, session }) {
  const userId = session?.user.id;
  const swrUrl = session ? `/api/user/${userId}/owned` : null;
  const { data: ownedPlantIds } = useSWR(swrUrl);

  async function handleToggleOwned(plantId, isOwned) {
    //define fetch options for toggle
    const fetchUrl = `/api/user/${userId}/owned/${plantId}`;
    const fetchOptions = {
      method: isOwned ? "DELETE" : "POST",
    };

    // Optimistic UI Update
    if (ownedPlantIds) {
      mutate(swrUrl, isOwned
        ? ownedPlantIds.filter(id => id !== plantId)
        : [...ownedPlantIds, plantId],
        false //false = no revalidation for now
      );

      //send API call
      await fetch(fetchUrl, fetchOptions);

      //SWR Revalidate
      mutate(swrUrl);
    }
  }

  return (
    <StyledPlantsList>
      {plants.map((plant) => {
        const isOwned = ownedPlantIds?.includes(plant._id);
        return (
          <li key={plant._id}>
            <Card
              plant={plant}
              isOwned={isOwned}
              onToggleOwned={() => handleToggleOwned(plant._id, isOwned)}
              session={session}
            />
          </li>
        );
      })}
    </StyledPlantsList>
  );
}

const StyledPlantsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  list-style: none;
  padding: 0;
`;
