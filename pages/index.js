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
        <p>There are no plants to admire.</p>
        <p>Why are there no plants?? Who murdered them? 🥲</p>
        <p>
          You can add plants via the + button. Why don&apos;t you go ahead and
          try it out?
        </p>
      </StyledMessage>
    );
  }
  return <PlantList plants={data} />;
}

const StyledMessage = styled.div`
  text-align: center;
  padding: 30px;
`;
