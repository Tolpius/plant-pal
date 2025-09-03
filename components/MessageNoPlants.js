import styled from "styled-components";

export default function MessageNoPlants() {
  return (
    <StyledMessage>
      <StyledText>There are no plants to admire.</StyledText>
      <StyledText>Why are there no plants?? Who murdered them? 🥲</StyledText>
      <StyledText>
        Don&apos;t you worry, we are already looking into this problem.
      </StyledText>
    </StyledMessage>
  );
}

const StyledMessage = styled.div`
  text-align: center;
  align-items: center;
  padding: 10px;
  padding-top: 30px;
  font-size: var(--font-size-lg);
`;

const StyledText = styled.p`
  padding-top: 10px;
`;
