import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { getPlantName } from "@/utils/plantHelpers";

export default function ReminderForm({ userId, reminderId }) {
  const router = useRouter();
  const { data: plants, error: plantsError } = useSWR(
    userId ? `/api/user/${userId}/owned` : null
  );
  const { data: reminder, error: reminderError } = useSWR(
    reminderId ? `/api/user/${userId}/reminders/${reminderId}` : null
  );

  const quickActions = ["Water", "Fertilise", "Repot"];
  const [title, setTitle] = useState(reminder?.title ?? "");
  const [plantId, setPlantId] = useState(reminder?.plantId ?? "");

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title || "");
      setPlantId(reminder.plantId || "");
    }
  }, [reminder]);

  if (plantsError) return <p>Failed to load plants</p>;
  if (!plants) return <p>Loading plants...</p>;
  if (reminderError) return <p>Failed to load reminder</p>;

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    data.title = title;

    const url = reminderId
      ? `/api/user/${userId}/reminders/${reminderId}`
      : `/api/user/${userId}/reminders`;
    const method = reminderId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success(
        reminderId
          ? "Reminder updated successfully."
          : "Reminder created successfully."
      );
      router.push("/reminders");
    } else {
      toast.error(
        reminderId ? "Failed to update reminder." : "Failed to create reminder."
      );
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <StyledLink href="/reminders" aria-label="cancel">
          <XCircleIcon size={28} />
        </StyledLink>
        <Title>{reminderId ? "Edit Reminder" : "New Reminder"}</Title>
        <IconButton type="submit" aria-label="save reminder">
          <CheckCircleIcon size={28} />
        </IconButton>
      </Header>

      <Label>
        Plant
        <Select
          name="plantId"
          required
          value={plantId}
          onChange={(event) => setPlantId(event.target.value)}
        >
          <option value="">Select a plant</option>
          {plants.map((plant) => (
            <option key={plant._id} value={plant._id}>
              {getPlantName(plant)}
            </option>
          ))}
        </Select>
      </Label>

      <Label>
        Title
        <Input
          type="text"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Label>

      <QuickActionsContainer>
        {quickActions.map((action) => (
          <QuickActionLabel key={action}>
            <input
              type="radio"
              name="titleRadio"
              value={action}
              checked={title === action}
              onChange={() => setTitle(action)}
            />
            {action}
          </QuickActionLabel>
        ))}
      </QuickActionsContainer>

      <Label>
        Description
        <Textarea
          name="description"
          defaultValue={reminder?.description || ""}
        />
      </Label>

      <Label>
        Due Date
        <Input
          type="date"
          name="dueDate"
          required
          defaultValue={reminder?.dueDate?.split("T")[0] || ""}
        />
      </Label>

      <Label>
        Time
        <Input type="time" name="time" defaultValue={reminder?.time || ""} />
      </Label>
    </Form>
  );
}

const Form = styled.form`
  padding: var(--padding-bg-md);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: var(--color-black);
  cursor: pointer;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: var(--padding-bg-sm);
  border: 1px solid var(--color-grey);
  border-radius: var(--radius-md);
  margin-top: 0.3rem;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: var(--padding-bg-sm);
  border: 1px solid var(--color-grey);
  border-radius: var(--radius-md);
  margin-top: 0.3rem;
`;

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  padding: var(--padding-bg-sm);
  margin-top: 0.3rem;
  border: 1px solid var(--color-grey);
  border-radius: var(--radius-md);
`;

const QuickActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0 1rem 0;
`;

const QuickActionLabel = styled.label`
  padding: var(--padding-small);
  background-color: var(--color-grey);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  user-select: none;

  input {
    display: none;
  }

  &:has(input:checked) {
    background-color: var(--color-primary);
    color: white;
  }
`;
