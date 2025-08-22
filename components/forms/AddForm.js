import styled from "styled-components";

export default function AddForm() {
  return (
    <Form>
      <h2>Add a new plant</h2>

      <Label>
        Name
        <Input name="name" type="text" />
      </Label>

      <Label>
        Botanical Name
        <Input name="botanicalName" type="text" />
      </Label>

      <Label>
        Image URL
        <Input name="imageURL" type="url" />
      </Label>

      <Fieldset>
        <legend>Water Need</legend>
        <Slider name="waterNeed" type="range" min="1" max="3" step="1" />
        <Scale>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </Scale>
      </Fieldset>

      <Fieldset>
        <legend>Light Need</legend>
        <Slider name="lightNeed" type="range" min="1" max="3" step="1" />
        <Scale>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </Scale>
      </Fieldset>

      <Fieldset>
        <legend>Fertiliser Season</legend>
        <CheckboxLabel>
          <input type="checkbox" name="fertiliserSeason" value="spring" />
          Spring
        </CheckboxLabel>
        <CheckboxLabel>
          <input type="checkbox" name="fertiliserSeason" value="summer" />
          Summer
        </CheckboxLabel>
        <CheckboxLabel>
          <input type="checkbox" name="fertiliserSeason" value="autumn" />
          Autumn
        </CheckboxLabel>
        <CheckboxLabel>
          <input type="checkbox" name="fertiliserSeason" value="winter" />
          Winter
        </CheckboxLabel>
      </Fieldset>

      <Label>
        Description
        <Textarea name="description" rows="4" />
      </Label>

      <Button type="submit">Save Plant</Button>
    </Form>
  );
}

/* styled-components */
const Form = styled.form`
  margin: 2rem auto;
  padding: 2rem;
  h2 {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const Scale = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #555;
`;

const Fieldset = styled.fieldset`
  border: none;
  margin-bottom: 1rem;

  legend {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
`;

const CheckboxLabel = styled.label`
  margin-right: 1rem;
  font-size: 0.9rem;

  input {
    margin-right: 0.3rem;
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: #2e7d32;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1b5e20;
  }
`;
