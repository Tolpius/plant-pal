import useSWR from "swr";
import Card from "@/components/Card";
import styled from "styled-components";

export default function HomePage() {
  const { data } = useSWR("/api/plants");

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <StyledPlantsList>
        {data.map((plant) => {
          return (
            <li key={plant._id}>
              <Card plant={plant} id={plant.id} />
            </li>
          );
        })}
      </StyledPlantsList>
    </div>
  );
}

const StyledPlantsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  list-style: none;
  padding: 0;
`;
