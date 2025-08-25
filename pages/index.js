import useSWR from "swr";
import styled from "styled-components";

import PlantList from "@/components/PlantList";

export default function HomePage() {
  const { data, isLoading } = useSWR("/api/plants");

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Failed to load plants!</p>;
  }

  if (data.length === 0) {
    return (
      <StyledMessage>
        There are no plants to admire. <br />
        <br />
        Why are there no plants?? <br />
        Who murdered them? 🥲
        <br />
        <br />
        <br />
        You can add plants <br />
        via the + button. <br />
        Why don&apos;t you go ahead <br />
        and try it out?
      </StyledMessage>
    );
  }
  return <PlantList plants={data} />;
}

const StyledMessage = styled.p`
  text-align: center;
`;
