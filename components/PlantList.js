import useLocalStorage from "use-local-storage";
import Card from "./Card";
import styled from "styled-components";

export default function PlantList({ plants }) {
  const [ownedPlantIds, setOwnedPlantIds] = useLocalStorage(
    "ownedPlantIds",
    []
  );

  function handleToggleOwned(plantId, isOwned) {
    if (isOwned) {
      setOwnedPlantIds(ownedPlantIds.filter((id) => id !== plantId));
    } else {
      setOwnedPlantIds([...ownedPlantIds,plantId]);
    }
  }

  return (
    <StyledPlantsList>
      {plants.map((plant) => {
        const isOwned = ownedPlantIds.includes(plant._id);
        return (
          <li key={plant._id}>
            <Card
              plant={plant}
              isOwned={isOwned}
              onToggleOwned={() => handleToggleOwned(plant._id, isOwned)}
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
