import styled from "styled-components";
import { useState } from "react";
import PlantImage from "../PlantImage";

export default function EditOwnedForm({ defaultData, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useUpload, setUseUpload] = useState(true);
  const [tempImagePath, setTempImagePath] = useState("");

  //handleFileUpload with help from ChatGPT
  async function handleFileUpload(file) {
    try {
      // 1. Get presignedURL from backend
      const res = await fetch("/api/images/getPresignedUploadUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          folder: "temp",
        }),
      });

      if (!res.ok) throw new Error("Failed to get presigned URL");

      const { url, key } = await res.json();

      // 2. Upload file directly to s3 backend
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("Upload to S3 failed");

      // 3. Save the key so API can find temp file and save it longterm
      setTempImagePath(key);
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (useUpload) {
      data.tempImageStoragePath = tempImagePath;
    } else {
      if (!data.userImageUrl.startsWith("https://images.unsplash.com")) {
        alert("Image URL must start with https://images.unsplash.com/");
        return;
      }
    }

    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Styledh2>Edit Plant</Styledh2>

      <PlantInfo>
        <StyledImage
          plant={defaultData}
          alt={defaultData.cataloguePlant?.name}
          height={"200"}
          width={"200"}
        />
        <NameWrapper>
          <StyledPlantName>{defaultData.cataloguePlant?.name}</StyledPlantName>
          <StyledBotanicalName>
            {defaultData.cataloguePlant?.botanicalName}
          </StyledBotanicalName>
        </NameWrapper>
      </PlantInfo>

      <Label>
        Nickname
        <Input
          name="nickname"
          type="text"
          defaultValue={defaultData.nickname}
        />
      </Label>

      <Label>
        Location
        <Input
          name="location"
          type="text"
          defaultValue={defaultData.location}
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
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  // 5 MB in Bytes
                  alert("File is too large! Max size is 5 MB.");
                  event.target.value = ""; // reset input
                  return;
                }
                handleFileUpload(file);
              }
            }}
          />
        </Label>
      ) : (
        <Label>
          Image URL
          <Input
            name="userImageUrl"
            type="text"
            required
            defaultValue={defaultData.imageUrl}
          />
        </Label>
      )}

      <Label>
        Acquired Date
        <Input
          name="acquiredDate"
          type="date"
          defaultValue={defaultData.acquiredDate?.split("T")[0]}
        />
      </Label>

      <Label>
        Notes
        <Textarea name="notes" rows="4" defaultValue={defaultData.notes} />
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

const StyledImage = styled(PlantImage)`
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
