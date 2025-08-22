import useLocalStorage from "use-local-storage";
import styled from "styled-components";
import { HeartStraightIcon } from "@phosphor-icons/react";
export default function HeartButton({handleToggleOwned, isOwned}) {

return (
  <HerzButton type="button" onClick={handleToggleOwned}>
    {isOwned ? <HeartStraightIcon weight="fill" color="red" /> : <HeartStraightIcon color="red" />}
  </HerzButton>
);
}

const HerzButton = styled.button`
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
