import styled from "styled-components";

export default function OwnedCounter({ length }) {
  return (
    <StyledCounter>
      {" "}
      {length === 0
        ? ``
        : `You own ${length} plant${length === 1 ? "" : "s"} of this kind`}
    </StyledCounter>
  );
}

const StyledCounter = styled.p`
  text-align: center;
  font-style: italic;
  color: grey;
  margin-bottom: 0;
`;
