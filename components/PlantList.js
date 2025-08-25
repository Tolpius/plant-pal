import useLocalStorage from "use-local-storage";
import Card from "./Card";
import styled from "styled-components";

export default function PlantList({ plants }) {
  const [ownedPlantIds, setOwnedPlantIds] = useLocalStorage(
    "ownedPlantIds",
    []
  );
  
  function handleToggleOwned() {
      if (isOwned) {
          setOwnedPlantIds(ownedPlantIds.filter((id) => id !== plant._id));
        } else {
            setOwnedPlantIds([...ownedPlantIds, plant._id]);
        }
    }
    
    return (
        <StyledPlantsList>
      {plants.map((plant) => (
        
        const isOwned = ownedPlantIds.includes(plant._id);
    return (
        <li key={plant._id}>
          <Card plant={plant} handleToggleOwned={handleToggleOwned}/>
        </li>
    )  ))}
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
