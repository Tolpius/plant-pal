import styled from "styled-components";

export default function PlantFilterForm({
  onSubmit,
  onClear,
  values,
  withOwnedFilter,
}) {  
  return (
    <StyledFilterForm>
      <form
        onSubmit={onSubmit}
        onChange={(event) => event.currentTarget.requestSubmit()}
      >
        <StyledLightWrapper>
          <legend>Light Need:</legend>
          <label>
            <input
              defaultChecked={values.lightNeed.includes("1")}
              type="checkbox"
              name="lightNeed"
              value="1"
              aria-label="Low light need"
            />
            <span aria-label="Full Shade">☁️</span>
          </label>
          <label>
            <input
              defaultChecked={values.lightNeed.includes("2")}
              type="checkbox"
              name="lightNeed"
              value="2"
              aria-label="Medium light need"
            />
            <span aria-label="Partly Shady">🌥️</span>
          </label>
          <label>
            <input
              defaultChecked={values.lightNeed.includes("3")}
              type="checkbox"
              name="lightNeed"
              value="3"
              aria-label="High light need"
            />
            <span aria-label="Sunny">☀️</span>
          </label>
        </StyledLightWrapper>

        <StyledWaterWrapper>
          <legend>Water Need:</legend>
          <label>
            <input
              defaultChecked={values.waterNeed.includes("1")}
              type="checkbox"
              name="waterNeed"
              value="1"
              aria-label="Low water need"
            />
            <span aria-label="little amount of water">💧</span>
          </label>
          <label>
            <input
              defaultChecked={values.waterNeed.includes("2")}
              type="checkbox"
              name="waterNeed"
              value="2"
              aria-label="Medium water need"
            />
            <span aria-label="medium amount of water">💧💧</span>
          </label>
          <label>
            <input
              defaultChecked={values.waterNeed.includes("3")}
              type="checkbox"
              name="waterNeed"
              value="3"
              aria-label="High water need"
            />
            <span aria-label="high amount of water">💧💧💧</span>
          </label>
        </StyledWaterWrapper>

        {withOwnedFilter && (
          <StyledHideWrapper>
            <label htmlFor="hide-owned">hide owned:</label>
            <input
              defaultChecked={values.hideOwned}
              id="hide-owned"
              type="checkbox"
              name="hideOwned"
            />
          </StyledHideWrapper>
        )}

        <StyledButtonWrapper>
          <StyledButton
            type="reset"
            onClick={onClear}
            aria-label="Clear all selections"
          >
            clear filter
          </StyledButton>
        </StyledButtonWrapper>
      </form>
    </StyledFilterForm>
  );
}

const StyledFilterForm = styled.div`
  background-color: var(--color-secondary-dark);
  color: var(--color-neutral-dark);
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
  background-color: var(--color-neutral-medium);
  border: 1px solid var(--color-light-grey);
  border-radius: var(--radius-sm);
`;
