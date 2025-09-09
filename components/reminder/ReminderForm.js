import { useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import styled from "styled-components";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

export default function ReminderForm({ userId }) {
  const router = useRouter();
  const { data: plants, error } = useSWR(
    userId ? `/api/user/${userId}/owned` : null
  );

  const [plantId, setPlantId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [time, setTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState("");
  const [recurringUnit, setRecurringUnit] = useState("days");

  if (error) return <p>Failed to load plants</p>;
  if (!plants) return <p>Loading plants...</p>;

  function handleQuickAction(action) {
    setTitle(action);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newReminder = {
      plantId,
      title,
      description,
      dueDate,
      time,
      isRecurring,
      recurringInterval,
      recurringUnit,
    };

    const response = await fetch(`/api/user/${userId}/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReminder),
    });

    if (response.ok) {
      await mutate(`/api/user/${userId}/reminders`);
      router.push("/reminders");
    } else {
      console.error("Failed to create reminder");
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
        <Select
          value={plantId}
          onChange={(event) => setPlantId(event.target.value)}
          required
        >
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
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <QuickActions>
          <QuickActionButton
            type="button"
            onClick={() => handleQuickAction("Water")}
          >
            Water
          </QuickActionButton>
          <QuickActionButton
            type="button"
            onClick={() => handleQuickAction("Fertilise")}
          >
            Fertilise
          </QuickActionButton>
        </QuickActions>
      </Label>

      <Label>
        Description
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Label>

      <Label>
        Due Date
        <Input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          required
        />
      </Label>

      <Label>
        Time
        <Input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
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
          <Input
            type="number"
            min="1"
            value={recurringInterval}
            onChange={(event) => setRecurringInterval(event.target.value)}
          />

          <Select
            value={recurringUnit}
            onChange={(event) => setRecurringUnit(event.target.value)}
          >
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

const QuickActions = styled.div`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const QuickActionButton = styled.button`
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  padding: var(--padding-small);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
`;

const Fieldset = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
`;
