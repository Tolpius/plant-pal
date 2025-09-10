import styled from "styled-components";
import { ArrowCircleLeftIcon } from "@phosphor-icons/react";
import { useRouter } from "next/router";

export default function BackButton({ href, ariaLabel = "Go back" }) {
  const router = useRouter();
  function handleClick() {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  }
  return (
    <StyledButton onClick={handleClick} aria-label={ariaLabel}>
      <ArrowCircleLeftIcon size={32} color="var(--color-text-base)" />
    </StyledButton>
  );
}

const StyledButton = styled.button`
  text-decoration: none;
  border: none;
  background-color: inherit;
  max-width: 3rem;
`;
