import styled from "styled-components";
import { useRouter } from "next/router";

export default function AddForm({ defaultData }) {
  const router = useRouter();

  async function addPlant(plant) {
    try {
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plant),
      });

      if (!response.ok) {
        throw new Error(`Failed to add plant: ${response.statusText}`);
      }

      const newPlant = await response.json();
      console.log("Plant added successfully:", newPlant);

      router.push(`/`);
    } catch (error) {
      console.error("Error adding plant:", error);
      alert("Failed to add plant. Please try again.");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const fertiliserSeasons = formData.getAll("fertiliserSeason");
    const dataWithSeasons = { ...data, fertiliserSeasons };
    

    // ONLY IMAGES FROM UNSPLASH FOR NOW
    if (!data.imageUrl.startsWith("https://images.unsplash.com")) {
      alert("Image URL must start with https://images.unsplash.com/");
      return;
    }
    if (fertiliserSeasons.length === 0) {
      alert("Please choose at least one Fertiliser Season!");
      return;
    }
    addPlant(dataWithSeasons);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Styledh2>Add a new plant</Styledh2>

      <Label>
        Name
        <Input name="name" type="text" required />
      </Label>

      <Label>
        Botanical Name
        <Input name="botanicalName" type="text" required />
      </Label>

      <Label>
        Image URL
        <Input name="imageUrl" type="text" required />
      </Label>

      <Fieldset>
        <legend>Water Need</legend>
        <Slider name="waterNeed" type="range" min="1" max="3" step="1" />
        <Scale>
          <span>💧</span>
          <span>💧💧</span>
          <span>💧💧💧</span>
        </Scale>
      </Fieldset>

      <Fieldset>
        <legend>Light Need</legend>
        <Slider name="lightNeed" type="range" min="1" max="3" step="1" />
        <Scale>
          <span>☁️</span>
          <span>🌥️</span>
          <span>☀️</span>
        </Scale>
      </Fieldset>

      <Fieldset>
        <legend>Fertiliser Season</legend>
        <CheckboxLabel>
          <input type="checkbox" name="fertiliserSeason" value="spring" />
          🌸
        </CheckboxLabel>
        <CheckboxLabel>
          <input type="checkbox" name="fertiliserSeason" value="summer" />
          ☀️
        </CheckboxLabel>
        <CheckboxLabel>
          <input type="checkbox" name="fertiliserSeason" value="autumn" />
          🍁
        </CheckboxLabel>
        <CheckboxLabel>
          <input type="checkbox" name="fertiliserSeason" value="winter" />
          ❄️
        </CheckboxLabel>
      </Fieldset>

      <Label>
        Description
        <Textarea name="description" rows="4" required />
      </Label>

      <Button type="submit">Save Plant</Button>
    </Form>
  );
}

/* styled-components */
const Form = styled.form`
  padding: 1.5rem;
  width: 100%;
`;

const Styledh2 = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;

  span:first-child {
    text-align: left;
  }

  span:last-child {
    text-align: right;
  }
`;

const Fieldset = styled.fieldset`
  border: none;
  margin-bottom: 1rem;
  padding: 0;
`;

const CheckboxLabel = styled.label`
  margin-right: 1rem;
  font-size: 0.9rem;
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
