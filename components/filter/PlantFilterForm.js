import { useRef } from "react";
import styled from "styled-components";

export default function PlantFilterForm({
  onSubmit,
  onClear,
  handleHideOwned,
}) {
  const formRef = useRef(null);
  return (
    <StyledFilterForm>
      <form ref={formRef} onChange={() => onSubmit(formRef)}>
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
        <StyledHideWrapper>
          {handleHideOwned ? (
            <>
              <label>hide owned:</label>
              <input type="checkbox" onClick={handleHideOwned}></input>
            </>
          ) : null}
        </StyledHideWrapper>

        <StyledButtonWrapper>
          <StyledButton type="reset" onClick={onClear}>
            clear filter
          </StyledButton>
        </StyledButtonWrapper>
      </form>
    </StyledFilterForm>
  );
}

const StyledFilterForm = styled.div`
  background-color: var(--color-white);
  border-radius: 0;
  overflow: hidden;
  padding: var(--padding-bg-sm);
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

const StyledHideWrapper = styled.div`
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
  border: 1px solid var(--color-light-grey);
  border-radius: var(--radius-sm);
`;
