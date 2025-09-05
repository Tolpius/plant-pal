import styled from "styled-components";

export default function Reminders() {
  return (
    <>
      <StyledText>Reminders</StyledText>
      <p>Today</p>
      <p>Tomorrow</p>
      <p>This Week</p>
      <p>Next Week</p>
    </>
  );
}

const StyledText = styled.p`
  padding-top: var(--padding-bg-sm);
  text-align: center;
  font-size: var(--font-size-xl);
`;
