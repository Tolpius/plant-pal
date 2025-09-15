import Card from "@/components/admin/AdminCatalogueCard";
import styled from "styled-components";

export default function AdminPlantList({ plants, onDelete, onTogglePublic }) {

    if(plants.error) return (<>Error loading plants: {plants.error}</>)
    if(plants.length === 0) return (<>No plants found. Check your filter.</>)
  return (
    <StyledPlantsList>
      {plants.map((plant) => {
        return (
          <li key={plant._id}>
            <Card plant={plant} onDelete={onDelete} onTogglePublic={onTogglePublic} />
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
