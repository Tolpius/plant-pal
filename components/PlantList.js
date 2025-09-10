import Card from "./Card";
import styled from "styled-components";

export default function PlantList({
  plants,
  session,
  isOwnedPlantList = false,
}) {
  return (
    <StyledPlantsList>
      {plants.map((plant) => {
        return (
          <li key={plant._id}>
            <Card
              session={session}
              plant={plant}
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
