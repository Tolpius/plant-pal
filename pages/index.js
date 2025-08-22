import useSWR from "swr";
import Card from "@/components/Card";
import styled from "styled-components";

export default function HomePage() {
  const { data, isLoading } = useSWR("/api/plants");

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }

  return (
    <StyledPlantsList>
      {data.map((plant) => (
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
