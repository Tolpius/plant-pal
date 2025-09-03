import { LightbulbIcon } from "@phosphor-icons/react";
import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

export default function FunFactDisplay(event) {
  const { data, isLoading } = useSWR(`/api/funfacts`);
  const [funFactPopUp, setFunFactPopUp] = useState(false);
  const [lastIndex, setLastIndex] = useState(null);

  if (isLoading) {
    return <p>Loading Funfact...</p>;
  }

  function getRandomIndex(lastIndex, length) {
    if (data.length <= 1) return 0;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * length);
    } while (newIndex === lastIndex);

    return newIndex;
  }

  function handleClick() {
    if (!data || data.length === 0) {
      setLastIndex(null);
    } else {
      const newIndex = getRandomIndex(lastIndex, data.length);
      setLastIndex(newIndex);
    }
    setFunFactPopUp(!funFactPopUp);
  }

  return (
    <Wrapper>
      {event.isExtendedNavList === true ? (
        <LightButton onClick={handleClick}>
          FunFact
          <LightbulbIcon className="icon" size="24" weight="regular" />
        </LightButton>
      ) : (
        <LightButton onClick={handleClick}>
          <LightbulbIcon className="icon" size="24" weight="regular" />
        </LightButton>
      )}
      {funFactPopUp && (
        <PopUpOverlay onClick={() => setFunFactPopUp(false)}>
          <StyledPopUpFunFact onClick={(event) => event.stopPropagation()}>
            <CancelButton
              onClick={() => setFunFactPopUp(false)}
              aria-label="Close fun fact pop-up"
            >
              X
            </CancelButton>
            {!data || data.length === 0 ? (
              <p>Sorry no Funfacts here 🥺</p>
            ) : (
              lastIndex !== null && <p>{data[lastIndex].text}</p>
            )}
          </StyledPopUpFunFact>
        </PopUpOverlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const LightButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: end;
  background: transparent;
  border: none;
  color: var(--color-secondary);
  width: 100%;
  font-size: var(--font-size-lg);
  transition: color 0.2s ease-in-out;
  &:hover {
    color: var(--color-black);
  }
`;

const PopUpOverlay = styled.button`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
`;

const CancelButton = styled.button`
  position: absolute;
  top: 10px;
  right: 12px;
  color: var(--color-white);
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  background-color: transparent;
  border: none;
  z-index: 16;
`;

const StyledPopUpFunFact = styled.article`
  display: flex;
  justify-content: center;
  font-size: var(--font-size-md);
  flex-direction: column;
  z-index: 5;
  position: fixed;
  width: 80%;
  height: auto;
  padding: 2rem;
  background-image: url("https://plus.unsplash.com/premium_photo-1664005877764-122a552ebf2e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
  box-shadow: 5px 5px 15px black;
  color: var(--color-white);
  text-shadow: 0 1px 3px black;
`;
