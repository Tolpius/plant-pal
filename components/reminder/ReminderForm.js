import { useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

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
    <form onSubmit={handleSubmit}>
      <h2>New Reminder</h2>

      <label>
        Plant:
        <select
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
        </select>
      </label>

      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>

      <div>
        <button type="button" onClick={() => handleQuickAction("Water")}>
          Water
        </button>
        <button type="button" onClick={() => handleQuickAction("Fertilise")}>
          Fertilise
        </button>
      </div>

      <label>
        Description:
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <label>
        Due Date:
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          required
        />
      </label>

      <label>
        Time:
        <input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
        />
      </label>

      <label>
        Recurring?
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(event) => setIsRecurring(event.target.checked)}
        />
      </label>

      {isRecurring && (
        <div>
          <label>
            Every:
            <input
              type="number"
              min="1"
              value={recurringInterval}
              onChange={(event) => setRecurringInterval(event.target.value)}
            />
          </label>
          <select
            value={recurringUnit}
            onChange={(event) => setRecurringUnit(event.target.value)}
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </div>
      )}

      <button type="button" onClick={() => router.push("/reminders")}>
        Cancel
      </button>
      <button type="submit">Done</button>
    </form>
  );
}
