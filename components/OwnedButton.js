import styled from "styled-components";
import { PlusSquareIcon } from "@phosphor-icons/react";
export default function OwnedButton({ onAddOwned }) {
  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    onAddOwned();
  }

  return (
    <StyledOwnedButton
      type="button"
      onClick={onClick}
      aria-label={"Add to owned plants list"}
    >
      <PlusSquareIcon color="darkgreen" />
      <span>Add</span>
    </StyledOwnedButton>
  );
}

const StyledOwnedButton = styled.button`
  position: relative;
  display: inline-flex;
  font-size: 1.25rem;
  border-width: 1px;
  width: auto;
  height: auto;
  background: var(--color-neutral-light);
  border-radius: 3px;
  padding: var(--padding-small);
  z-index: 2;
  &:hover {
    cursor: pointer;
    background: lightgray;
  }
`;
