import styled from "styled-components";
import { useRef } from "react";

export default function PlantFilter({ onSubmit, onClear }) {
  const form = useRef(null);

  function handleClearFilter() {
    form.current.reset();
    onClear();
  }

  return (
    <StyledFilterForm>
      <form ref={form} onSubmit={onSubmit}>
        <StyledLightWrapper>
          <legend>Light Need:</legend>
          <label>
            <input type="checkbox" name="lightNeed" value="1" />
            <span>☁️</span>
          </label>
          <label>
            <input type="checkbox" name="lightNeed" value="2" />
            <span>🌥️</span>
          </label>
          <label>
            <input type="checkbox" name="lightNeed" value="3" />
            <span>☀️</span>
          </label>
        </StyledLightWrapper>
        <StyledWaterWrapper>
          <legend>Water Need:</legend>
          <label>
            <input type="checkbox" name="waterNeed" value="1" />
            <span>💧</span>
          </label>
          <label>
            <input type="checkbox" name="waterNeed" value="2" />
            <span>💧💧</span>
          </label>
          <label>
            <input type="checkbox" name="waterNeed" value="3" />
            <span>💧💧💧</span>
          </label>
        </StyledWaterWrapper>
        <StyledButtonWrapper>
          <StyledButton type="submit">apply</StyledButton>
          <StyledButton
            type="button"
            onClick={() => {
              handleClearFilter();
            }}
          >
            clear
          </StyledButton>
        </StyledButtonWrapper>
      </form>
    </StyledFilterForm>
  );
}

const StyledFilterForm = styled.div`
  background-color: white;
  border-radius: 15px;
  font-size: medium;
  overflow: hidden;
  padding: 10px;
`;

const StyledLightWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0 10px 50px;
`;

const StyledWaterWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 0 0 20px 50px;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 15px;
`;

const StyledButton = styled.button`
  padding: 5px 15px;
  border: 1px solid lightgray;
  border-radius: 5px;
`;
