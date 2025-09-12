import styled from "styled-components";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function PlantForm({ defaultData, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useUpload, setUseUpload] = useState(true);
  const [tempImagePath, setTempImagePath] = useState("");
  const isEdit = !!defaultData;
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const showPublicCheckbox =
    router.pathname.startsWith("/plants/") ||
    router.pathname.startsWith("/add");

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("imageFile", file);

    try {
      const response = await fetch("/api/uploadTemp", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setTempImagePath(data.tempPath);
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const fertiliserSeasons = formData.getAll("fertiliserSeason");
    const dataWithSeasons = { ...data, fertiliserSeasons };

    if (useUpload) {
      if (!tempImagePath) {
        alert("Please upload an image!");
        return;
      }
      dataWithSeasons.tempImageStoragePath = tempImagePath;
    } else {
      if (!data.imageUrl.startsWith("https://images.unsplash.com")) {
        alert("Image URL must start with https://images.unsplash.com/");
        return;
      }
    }

    if (fertiliserSeasons.length === 0) {
      alert("Please choose at least one Fertiliser Season!");
      return;
    }

    setIsSubmitting(true);
    await onSubmit(dataWithSeasons);
    setIsSubmitting(false);
  }

  if (sessionStatus === "loading") return <p>Loading....</p>;
  return (
    <Form onSubmit={handleSubmit}>
      <Styledh2>
        {isEdit ? `Edit ${defaultData.name}` : `Add a new plant`}
      </Styledh2>
      {session.user.role === "admin" && (
        <Fieldset>
          <legend>Admin Settings</legend>
          {showPublicCheckbox && (
            <CheckboxLabel>
              <input
                type="checkbox"
                name="isPublic"
                value="true"
                defaultChecked={isEdit && defaultData.isPublic}
                aria-label="Make public"
              />
              make public
            </CheckboxLabel>
          )}
          {!isEdit && (
            <CheckboxLabel>
              <input
                type="checkbox"
                name="addOwned"
                value="true"
                aria-label="add to owned plants"
              />
              Add to owned plants
            </CheckboxLabel>
          )}
        </Fieldset>
      )}
      <Label>
        Name
        <Input
          name="name"
          type="text"
          required
          defaultValue={isEdit ? defaultData.name : ""}
        />
      </Label>

      <Label>
        Botanical Name
        <Input
          name="botanicalName"
          type="text"
          required
          defaultValue={isEdit ? defaultData.botanicalName : ""}
        />
      </Label>

      <Label>
        Do you want to upload your own image or give us an URL?
        <ToggleContainer>
          <span>URL</span>
          <SwitchLabel>
            <SwitchCheckbox
              type="checkbox"
              checked={useUpload}
              onChange={() => setUseUpload(!useUpload)}
            />
            <SwitchSlider />
          </SwitchLabel>
          <span>Upload</span>
        </ToggleContainer>
      </Label>
      {useUpload ? (
        <Label>
          Upload Image
          <Input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files[0];
              if (file) handleFileUpload(file);
            }}
          />
        </Label>
      ) : (
        <Label>
          Image URL
          <Input
            name="imageUrl"
            type="text"
            required
            defaultValue={isEdit ? defaultData.imageUrl : ""}
          />
        </Label>
      )}

      <Fieldset>
        <legend>Water Need</legend>
        <Slider
          name="waterNeed"
          type="range"
          min="1"
          max="3"
          step="1"
          defaultValue={isEdit ? defaultData.waterNeed : "1"}
          aria-label="Water need level"
        />
        <Scale>
          <span aria-label="Low water need">💧</span>
          <span aria-label="Medium water need">💧💧</span>
          <span aria-label="High water need">💧💧💧</span>
        </Scale>
      </Fieldset>

      <Fieldset>
        <legend>Light Need</legend>
        <Slider
          name="lightNeed"
          type="range"
          min="1"
          max="3"
          step="1"
          defaultValue={isEdit ? defaultData.lightNeed : "1"}
          aria-label="Light need level"
        />
        <Scale>
          <span aria-label="Low light need">☁️</span>
          <span aria-label="Medium light need">🌥️</span>
          <span aria-label="High light need">☀️</span>
        </Scale>
      </Fieldset>

      <Fieldset>
        <legend>Fertiliser Season</legend>
        <CheckboxLabel>
          <StyledCheckBox
            type="checkbox"
            name="fertiliserSeason"
            value="spring"
            defaultChecked={
              isEdit && defaultData.fertiliserSeasons.includes("spring")
            }
            aria-label="Spring fertiliser season"
          />
          🌸
        </CheckboxLabel>
        <CheckboxLabel>
          <StyledCheckBox
            type="checkbox"
            name="fertiliserSeason"
            value="summer"
            defaultChecked={
              isEdit && defaultData.fertiliserSeasons.includes("summer")
            }
            aria-label="Summer fertiliser season"
          />
          ☀️
        </CheckboxLabel>
        <CheckboxLabel>
          <StyledCheckBox
            type="checkbox"
            name="fertiliserSeason"
            value="autumn"
            defaultChecked={
              isEdit && defaultData.fertiliserSeasons.includes("autumn")
            }
            aria-label="Autumn fertiliser season"
          />
          🍁
        </CheckboxLabel>
        <CheckboxLabel>
          <StyledCheckBox
            type="checkbox"
            name="fertiliserSeason"
            value="winter"
            defaultChecked={
              isEdit && defaultData.fertiliserSeasons.includes("winter")
            }
            aria-label="Winter fertiliser season"
          />
          ❄️
        </CheckboxLabel>
      </Fieldset>
      <Label>
        Description
        <Textarea
          name="description"
          rows="4"
          required
          defaultValue={isEdit ? defaultData.description : ""}
        />
      </Label>
      <Button
        type="submit"
        disabled={isSubmitting}
        aria-label={isEdit ? "Submit changes to the plant" : "Add a new plant"}
      >
        {isEdit ? "Edit Plant" : "Add Plant"}
      </Button>
    </Form>
  );
}

const Form = styled.form`
  color: var(--color-neutral-base);
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
  background-color: var(--color-secondary-dark);
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-grey);
  border-radius: var(--radius-md);

  color: var(--color-neutral-base);
`;

const StyledCheckBox = styled.input.attrs({ type: "checkbox" })`
  accent-color: var(--color-primary);
`;

const Textarea = styled.textarea`
  display: block;
  background-color: var(--color-secondary-dark);
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid var(--color-grey);
  border-radius: var(--radius-md);
  color: var(--color-neutral-base);
`;

const Slider = styled.input.attrs({ type: "range" })`
  background-color: var(--color-primary);
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
  background: var(--color-primary);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--color-primary-dark);
  }
`;
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin: 0 0.5rem;
`;

const SwitchCheckbox = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: var(--color-primary);
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-grey);
  border-radius: 34px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
`;
