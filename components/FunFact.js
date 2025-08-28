import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

export default function FunFactDisplay() {
  const { data, isLoading } = useSWR(`/api/funfacts`);
  const [funFactPopUp, setFunFactPopUp] = useState(false);
  const [lastIndex, setLastIndex] = useState(null);

  if (isLoading) {
    return <p>Loading Funfact...</p>;
  }

  function getRandomIndex(lastIndex, length) {
    if (data.length <= 1) return 0;
    const newIndex = Math.floor(Math.random() * length);

    if (newIndex === lastIndex) {
      return getRandomIndex(lastIndex, length);
    }

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
      <LightButton onClick={handleClick}>💡</LightButton>
      {}
      {funFactPopUp && (
        <PopUpOverlay onClick={() => setFunFactPopUp(false)}>
          <StyledPopUpFunFact onClick={(event) => event.stopPropagation()}>
            <CancelButton onClick={() => setFunFactPopUp(false)}>
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
`;

const LightButton = styled.button`
  padding: 0.5rem;
`;

const PopUpOverlay = styled.button`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

const CancelButton = styled.button`
  position: absolute;
  top: 10px;
  right: 12px;
  color: white;
  width: 12%;
  height: 12%;
  background-color: transparent;
  border: none;
  z-index: 6;
`;

const StyledPopUpFunFact = styled.article`
  display: flex;
  justify-content: center;
  font-size: medium;
  flex-direction: column;
  z-index: 5;
  position: fixed;
  width: 80%;
  height: 40%;
  padding: 40px;
  background-color: #f8fff8;
  background-image: url("https://plus.unsplash.com/premium_photo-1664005877764-122a552ebf2e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%2394c973' fill-opacity='0.2'%3E%3Ccircle cx='10' cy='10' r='6'/%3E%3Ccircle cx='30' cy='30' r='6'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat;
  border-radius: 25px;
  box-shadow: 5px 5px 15px black;
  color: white;
`;
