import styled from "styled-components";
import {
  CheckCircleIcon,
  PlusSquareIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
export default function OwnedButton({ onAddOwned }) {
  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Trying to add plant!")
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
  /* bottom: -15px; */
  background: white;
  border-radius: 3px;
  padding: var(--pd-sm);
  z-index: 2;
`;
