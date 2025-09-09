import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

export default function ReminderForm({ userId }) {
  const router = useRouter();
  const { data: plants, error } = useSWR(
    userId ? `/api/user/${userId}/owned` : null
  );

  const [title, setTitle] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const quickActions = ["Water", "Fertilise", "Repot"];

  if (error) return <p>Failed to load plants</p>;
  if (!plants) return <p>Loading plants...</p>;

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const newReminder = {
      ...data,
      isRecurring,
    };

    const response = await fetch(`/api/user/${userId}/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReminder),
    });

    if (response.ok) {
      router.push("/reminders");
    } else {
      console.error("Failed to create reminder");
    }
  }

  function handleQuickAction(action) {
    const titleInput = document.querySelector("input[name='title']");
    if (titleInput) {
      titleInput.value = action;
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <IconButton type="button" onClick={() => router.push("/reminders")}>
          <XCircleIcon size={28} />
        </IconButton>
        <Title>New Reminder</Title>
        <IconButton type="submit">
          <CheckCircleIcon size={28} />
        </IconButton>
      </Header>

      <Label>
        Plant
        <Select name="plantId" required>
          <option value="">Select a plant</option>
          {plants.map((plant) => (
            <option key={plant._id} value={plant._id}>
              {plant.name}
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
        <Textarea name="description" />
      </Label>

      <Label>
        Due Date
        <Input type="date" name="dueDate" required />
      </Label>

      <Label>
        Time
        <Input type="time" name="time" />
      </Label>

      <Label>
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(event) => setIsRecurring(event.target.checked)}
        />
        Recurring?
      </Label>

      {isRecurring && (
        <Fieldset>
          <label>Every</label>
          <Input type="number" name="recurringInterval" min="1" />
          <Select name="recurringUnit" defaultValue="days">
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </Select>
        </Fieldset>
      )}
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

const IconButton = styled.button`
  background: none;
  border: none;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: var(--padding-bg-sm);
  border: 1px solid var(--color-light-grey);
  border-radius: var(--radius-md);
  margin-top: 0.3rem;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: var(--padding-bg-sm);
  border: 1px solid var(--color-light-grey);
  border-radius: var(--radius-md);
  margin-top: 0.3rem;
`;

const Textarea = styled.textarea`
  display: block;
  width: 100%;
  padding: var(--padding-bg-sm);
  margin-top: 0.3rem;
  border: 1px solid var(--color-light-grey);
  border-radius: var(--radius-md);
`;

const QuickActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0 1rem 0;
`;

const QuickActionLabel = styled.label`
  padding: var(--padding-small);
  background-color: var(--color-light-grey);
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

const Fieldset = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
`;
