import styled from "styled-components";
import { CheckCircleIcon, PlusCircleIcon } from "@phosphor-icons/react";
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
        <PlusCircleIcon color="darkgreen" />
      )}
    </StyledOwnedButton>
  );
}

const StyledOwnedButton = styled.button`
  font-size: 1.25rem;
  border-style: none;
  width: 2em;
  height: 2em;
  bottom: -15px;
  transform: translateX(-50%);
  left: 50%;
  background: white;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  z-index: 2;
`;
