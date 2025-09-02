import Link from "next/link";
import styled from "styled-components";
import { ArrowCircleLeftIcon } from "@phosphor-icons/react";

export default function BackButton({ href = "/", ariaLabel = "Go back" }) {
  return (
    <StyledLink href={href} aria-label={ariaLabel}>
      <ArrowCircleLeftIcon size={32} />
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  &:visited {
    color: inherit;
  }
`;
