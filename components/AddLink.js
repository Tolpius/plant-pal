import Link from "next/link";
import styled from "styled-components";

export const AddLink = styled(Link)`
  border: 1px solid #000000;
  border-radius: var(--radius-bg-md);
  background-color: var(--color-neutral-light);
  text-decoration: none;
  text-align: center;
  padding: var(--padding-bg-sm);
  &:visited {
    color: inherit;
  }
`;
