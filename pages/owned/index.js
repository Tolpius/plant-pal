import useSWR from "swr";
import Card from "@/components/Card";
import styled from "styled-components";
import useLocalStorage from "use-local-storage";

export default function Owned() {
  const { data, isLoading } = useSWR("/api/plants");
  const [ownedPlantIds] = useLocalStorage("ownedPlantIds", []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }
  console.log(data);
  const ownedData = data.filter((plant) => ownedPlantIds.includes(plant._id));
  if (ownedData.length == 0) {
    return (
      <p>
        You dont own any plants. <br />
        Are you okay?
        <br />
        Go get some Plants!
        <br />
        They are good for you.
      </p>
    );
  }
  return (
    <StyledPlantsList>
      {ownedData.map((plant) => (
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
