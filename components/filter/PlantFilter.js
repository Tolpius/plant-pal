import styled, { css } from "styled-components";
import { useState } from "react";
import PlantFilterForm from "./PlantFilterForm";

export default function PlantFilter({
  onFilter,
  values,
  withOwnedFilter = false,
}) {
  const [showFilter, setShowFilter] = useState(false);
  function handleFilterSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const lightNeed = formData.getAll("lightNeed");
    const waterNeed = formData.getAll("waterNeed");
    const hideOwned = formData.get("hideOwned") !== null;

    onFilter({ lightNeed, waterNeed, hideOwned });
  }

  function handleClearSubmit() {
    onFilter({ lightNeed: [], waterNeed: [], hideOwned: false });
  }

  return (
    <FilterContainer $displayBorder={showFilter}>
      <ButtonContainer $sizeOfButton={showFilter}>
        <FilterButton
          $displayBorder={showFilter}
          onClick={() => setShowFilter((previousValue) => !previousValue)}
          type="button"
          aria-label={
            showFilter ? "Hide filter options" : "Show filter options"
          }
        >
          <TextWrapper $textPlace={showFilter}>
            <p>{!showFilter ? "Filter ⬇️" : "Filter ⬆️"}</p>
          </TextWrapper>
        </FilterButton>
      </ButtonContainer>

      {showFilter && (
        <PlantFilterForm
          onSubmit={handleFilterSubmit}
          onClear={handleClearSubmit}
          withOwnedFilter={withOwnedFilter}
          values={values}
        />
      )}
    </FilterContainer>
  );
}

const FilterContainer = styled.div`
  ${(props) =>
    props.$displayBorder
      ? css`
          border: 1px solid black;
          border-radius: 15px;
          overflow: hidden;
        `
      : css`
          border: none;
        `};
`;

const ButtonContainer = styled.div`
  display: grid;
  ${(props) =>
    props.$sizeOfButton
      ? css`
          grid-template-columns: 1fr;
        `
      : css`
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        `};
`;

const FilterButton = styled.button`
  width: 100%;
  padding: var(--padding-bg-sm);
  background-color: var(--color-primary-light);
  border-radius: var(--radius-bg-md);
  font-size: var(--font-size-md);
  ${(props) =>
    props.$displayBorder
      ? css`
          border: none;
          border-radius: 0;
        `
      : css`
          border: var(--border-sm-dark);
        `};
`;

const TextWrapper = styled.div`
  display: grid;
  ${(props) =>
    props.$textPlace
      ? css`
          grid-template-columns: repeat(2, 1fr);
          gap: 3rem;
        `
      : css`
          grid-template-columns: 1fr;
        `};
`;
