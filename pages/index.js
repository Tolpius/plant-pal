// import useSWR from "swr";
import Card from "@/components/Card";
import { plants } from "@/db/setTheData";
import styled from "styled-components";

export default function HomePage() {
  // const { data } = useSWR("/api/plants");

  // if (!data) {
  //   return <p>Loading...</p>;
  // }

  return (
    <div>
      <h1>Plant Pal</h1>

      <StyledPlantsList>
        {plants.map((plant) => {
          return (
            <li key={plant._id}>
              <Card plant={plant} />
            </li>
          );
        })}
      </StyledPlantsList>
    </div>
  );
}

const StyledPlantsList = styled.ul`
  display: grid;
  list-style: none;
  padding: 0;
`;
