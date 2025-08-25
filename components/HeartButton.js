import styled from "styled-components";
import { HeartStraightIcon } from "@phosphor-icons/react";
export default function HeartButton({ onToggleOwned, isOwned }) {
  function onClick(event) {
    event.preventDefault();
    event.stopPropagation();
    onToggleOwned();
  }

  return (
    <StyledHeartButton type="button" onClick={onClick}>
      {isOwned ? (
        <HeartStraightIcon weight="fill" color="red" />
      ) : (
        <HeartStraightIcon color="red" />
      )}
    </StyledHeartButton>
  );
}

const StyledHeartButton = styled.button`
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
