import styled from "styled-components";

export default function PlantCounter({ length }) {
  return <StyledCounter> {length} plants are shown.</StyledCounter>;
}

const StyledCounter = styled.p`
  text-align: center;
  font-style: italic;
  color: grey;
  margin-bottom: 0;
`;
