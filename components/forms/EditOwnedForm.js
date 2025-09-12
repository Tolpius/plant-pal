import styled from "styled-components";
import { useState } from "react";

export default function EditOwnedForm({ defaultData, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!defaultData;

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Styledh2>Edit Plant</Styledh2>

      <PlantInfo>
        <StyledImage
          src={
            defaultData.userImageUrl ||
            defaultData.cataloguePlantId?.imageUrl ||
            "/defaultImage.png"
          }
          alt={defaultData.cataloguePlantId?.name || "Plant image"}
        />
        <NameWrapper>
          <StyledPlantName>
            {defaultData.cataloguePlantId?.name}
          </StyledPlantName>
          <StyledBotanicalName>
            {defaultData.cataloguePlantId?.botanicalName}
          </StyledBotanicalName>
        </NameWrapper>
      </PlantInfo>

      <Label>
        Nickname
        <Input
          name="nickname"
          type="text"
          defaultValue={isEdit ? defaultData.nickname : ""}
        />
      </Label>

      <Label>
        Location
        <Input
          name="location"
          type="text"
          defaultValue={isEdit ? defaultData.location : ""}
        />
      </Label>

      <Label>
        Image URL
        <Input
          name="userImageUrl"
          type="text"
          required
          defaultValue={isEdit ? defaultData.userImageUrl : ""}
        />
      </Label>

      <Label>
        Acquired Date
        <Input
          name="acquiredDate"
          type="date"
          defaultValue={isEdit ? defaultData.acquiredDate?.split("T")[0] : ""}
        />
      </Label>

      <Label>
        Notes
        <Textarea
          name="notes"
          rows="4"
          defaultValue={isEdit ? defaultData.notes : ""}
        />
      </Label>

      <Button type="submit" disabled={isSubmitting}>
        Save Changes
      </Button>
    </Form>
  );
}

const Form = styled.form`
  padding: var(--padding-large);
  width: 100%;
  color: var(--color-neutral-base);
`;

const Styledh2 = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: var(--padding-small);
  margin-top: 0.2rem;
  border: 1px solid var(--color-grey);
  border-radius: var(--radius-md);
  background-color: var(--color-secondary-dark);
  color: var(--color-neutral-base);
`;

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  padding: var(--padding-small);
  margin-top: 0.2rem;
  border: 1px solid var(--color-grey);
  border-radius: var(--radius-md);
  background-color: var(--color-secondary-dark);
  color: var(--color-neutral-base);
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: var(--padding-bg-sm);
  background: var(--color-primary);
  color: var(--color-white);
  font-weight: bold;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const PlantInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const StyledImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-md);
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledPlantName = styled.p`
  font-weight: bold;
  margin: 0;
`;

const StyledBotanicalName = styled.p`
  font-style: italic;
  margin: 0;
  color: var(--color-gray-600);
`;
