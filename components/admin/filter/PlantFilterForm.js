import styled from "styled-components";

export default function PlantFilterForm({ onSubmit }) {
  return (
    <StyledFilterForm>
      <form onSubmit={onSubmit}>
        <StyledVisibilityWrapper>
          <legend>Public/Private:</legend>
          <label>
            <input type="radio" name="isPublic" value="true" />
            <span>Show Public</span>
          </label>
          <label>
            <input type="radio" name="isPublic" value="false" />
            <span>Show Private</span>
          </label>
          <label>
            <input type="radio" name="isPublic" value="all" defaultChecked />
            <span>Show All</span>
          </label>
        </StyledVisibilityWrapper>
        <StyledButtonWrapper>
          <StyledButton type="submit">apply</StyledButton>
        </StyledButtonWrapper>
      </form>
    </StyledFilterForm>
  );
}

const StyledFilterForm = styled.form`
  background-color: var(--color-white);
  border-radius: 0;
  overflow: hidden;
  padding: var(--padding-bg-sm);
`;

const StyledVisibilityWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0 10px 50px;
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
