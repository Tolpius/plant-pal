import styled from "styled-components";
import { ArrowCircleLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/router";

export default function BackButton({
  ariaLabel = "Go back",
})
 {
  const router = useRouter()
  return (
    <StyledButton onClick={() => router.back()} aria-label={ariaLabel}>
      <ArrowCircleLeftIcon size={32} />
    </StyledButton>
  );
}

const StyledButton = styled.button`
  text-decoration: none;
  border: none;
  background-color: inherit;
  max-width: 3rem;
  &:visited {
    color: inherit;
  }
`;
