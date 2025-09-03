import styled from "styled-components";
import { CheckCircleIcon, PlusSquareIcon } from "@phosphor-icons/react";

export default function OwnedButton({ onToggleOwned, isOwned }) {
  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    onToggleOwned();
  }

  return (
    <StyledOwnedButton
      type="button"
      onClick={onClick}
      aria-label={
        isOwned ? "Remove from owned plants list" : "Add to owned plants list"
      }
    >
      {isOwned ? (
        <CheckCircleIcon weight="fill" color="darkgreen" />
      ) : (
        <>
          <PlusSquareIcon color="darkgreen" />
          <span>Add</span>
        </>
      )}
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
  background: white;
  border-radius: 3px;
  padding: var(--padding-small);
  z-index: 2;
`;
