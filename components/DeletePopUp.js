import styled, { css } from "styled-components";

export default function DeletePopUp({ onDelete, onCancel }) {
  return (
    <WarningOverlay onClick={onCancel}>
      <StyledPopUpWarning onClick={event => event.stopPropagation()}>
        <StyledWarningMessage>
          Are you sure you want to remove this plant? This decision is not
          reversible!
        </StyledWarningMessage>
        <ButtonWrapper>
          <StyledButton $variant="secondary" onClick={onCancel}>
            cancel
          </StyledButton>
          <StyledButton $variant="default" onClick={onDelete}>
            Remove
          </StyledButton>
        </ButtonWrapper>
      </StyledPopUpWarning>
    </WarningOverlay>
  );
}

const WarningOverlay = styled.button`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
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
  background-color: lightgray;
  border-radius: 25px;
  box-shadow: 5px 5px 15px;
`;

const StyledWarningMessage = styled.p`
  padding: 20px;
  padding-top: 40px;
  font-size: large;
  text-align: center;
  height: 60%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  height: 30px;
`;

const StyledButton = styled.button`
  font-size: medium;
  width: 100px;
  border-radius: 5px;

  ${(props) =>
    props.$variant === "default" &&
    css`
      background-color: lightgray;
    `}

  ${(props) =>
    props.$variant === "secondary" &&
    css`
      background-color: darkslategray;
      color: white;
    `}
`;
