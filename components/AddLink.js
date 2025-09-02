import Link from "next/link";
import styled from "styled-components";

export default function AddLink() {
  return (
    <>
      <StyledLink href="/add">
        <p>Didnt find your Plant? Create your own!</p>
      </StyledLink>
    </>
  );
}

const StyledLink = styled(Link)`
border:1px solid #000000;
border-radius: 10px;
background: var(--color-green-300);
text-decoration: none;
text-align: center;
padding: var(--pd-sm);
  &:visited {
    color: inherit;
  }
`;
