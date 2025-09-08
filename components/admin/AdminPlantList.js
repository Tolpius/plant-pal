import Card from "@/components/admin/AdminCatalogueCard";
import styled from "styled-components";

export default function PlantList({ plants }) {

    if(plants.error) return (<>Error loading plants: {plants.error}</>)
  return (
    <StyledPlantsList>
      {plants.map((plant) => {
        return (
          <li key={plant._id}>
            <Card plant={plant} />
          </li>
        );
      })}
    </StyledPlantsList>
  );
}

const StyledPlantsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  align-items: stretch;
`;
