import Card from "./Card";
import styled from "styled-components";

export default function PlantList({ plants, session, isOwnedPlantList = false, hideOwned }) {
  const userId = session?.user.id;


  // Später nochmal über useSWR und alles schauen wegen Owned plants und catalogue

  async function handleAddOwned(plantId) {
    //define fetch options for toggle
    const fetchUrl = `/api/user/${userId}/owned/${plantId}`;
    const fetchOptions = {
      method: "POST",
    };

    //send API call
    await fetch(fetchUrl, fetchOptions);
  }

  return (
    <StyledPlantsList>
      {plants
        .filter((plant) => {
          const isOwned = ownedPlantIds?.includes(plant._id);
          if (isOwned && hideOwned) return false;
          else return true;
        })
        .map((plant) => {
            return (
            <li key={plant._id}>
              <Card
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
