import styled from "styled-components";

export default function MessageNoPlants() {
  return (
    <StyledMessage>
      <p>There are no plants to admire.</p>
      <p>Why are there no plants?? Who murdered them? 🥲</p>
      <p>
        You can add plants via the + button. Why don&apos;t you go ahead and try
        it out?
      </p>
    </StyledMessage>
  );
}

const StyledMessage = styled.div`
  text-align: center;
  padding: 10px;
  padding-top: 30px;
  gap: 15px;
text-align: center;
font-size: var(--fs-lg);
`;

const StyledText = styled.p`
  padding-top: 10px;
`;
