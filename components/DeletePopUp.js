import styled, { css } from "styled-components";

export default function DeletePopUp({ onDelete, onCancel }) {
  return (
    <WarningOverlay onClick={onCancel}>
      <StyledPopUpWarning onClick={(event) => event.stopPropagation()}>
        <StyledWarningMessage>
          Are you sure you want to delete this plant? This decision is not
          reversible!
        </StyledWarningMessage>
        <ButtonWrapper>
          <StyledButton $variant="secondary" onClick={onCancel}>
            cancel
          </StyledButton>
          <StyledButton $variant="default" onClick={onDelete}>
            delete
          </StyledButton>
        </ButtonWrapper>
      </StyledPopUpWarning>
    </WarningOverlay>
  );
}

const WarningOverlay = styled.button`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
  border: none;
`;

const StyledPopUpWarning = styled.article`
  display: flex;
  flex-direction: column;
  z-index: 2;
  position: fixed;
  width: 80%;
  height: 40%;
  padding: 20px;
  background-color: var(--color-neutral-light);
  border-radius: 25px;
  box-shadow: 5px 5px 15px;
`;

const StyledWarningMessage = styled.p`
  padding: 20px;
  padding-top: 40px;
  font-size: var(--font-size-md);
  text-align: center;
  height: 60%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  height: 30px;
`;

const StyledButton = styled.button`
  font-size: var(--font-size-sm);
  width: 100px;
  border-radius: var(--radius-sm);

  ${(props) =>
    props.$variant === "default" &&
    css`
      background-color: var(--color-neutral-light);
    `}

  ${(props) =>
    props.$variant === "secondary" &&
    css`
      background-color: var(--color-neutral-dark);
      color: var(--color-white);
    `}
`;
