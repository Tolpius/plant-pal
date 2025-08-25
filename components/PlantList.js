import Card from "./Card";
import styled from "styled-components";

export default function PlantList({ plants }) {
  return (
    <StyledPlantsList>
      {plants.map((plant) => (
        <li key={plant._id}>
          <Card plant={plant} />
        </li>
      ))}
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
