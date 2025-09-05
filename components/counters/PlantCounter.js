import styled from "styled-components";

export default function PlantCounter({ length }) {
  return (
    <StyledCounter role="status" aria-live="polite">
      {length === 0
        ? `Sorry, we couldn't find any plants with this filter.`
        : `${length} plants are shown.`}
    </StyledCounter>
  );
}

const StyledCounter = styled.p`
  text-align: center;
  font-style: italic;
  color: var(--color-text-medium);
  margin-bottom: 0;
`;
