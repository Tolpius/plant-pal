import Link from "next/link";
import styled from "styled-components";

export const AddLink = styled(Link)`
  border: 1px solid #000000;
  border-radius: 10px;
  background: var(--color-green-300);
  text-decoration: none;
  text-align: center;
  padding: var(--pd-sm);
  &:visited {
    color: inherit;
  }
`;
