import useSWR from "swr";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";

import ReminderCard from "@/components/ReminderCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

function groupReminders(reminders) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const endOfThisWeek = new Date(today);
  endOfThisWeek.setDate(today.getDate() + (7 - today.getDay()));

  const startOfNextWeek = new Date(endOfThisWeek);
  startOfNextWeek.setDate(endOfThisWeek.getDate() + 1);

  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

  const groups = {
    Today: [],
    Tomorrow: [],
    "This Week": [],
    "Next Week": [],
    Later: [],
  };

  reminders.forEach((reminder) => {
    const due = new Date(reminder.dueDate);
    due.setHours(0, 0, 0, 0);

    if (due.getTime() === today.getTime()) groups.Today.push(reminder);
    else if (due.getTime() === tomorrow.getTime())
      groups.Tomorrow.push(reminder);
    else if (due > tomorrow && due <= endOfThisWeek)
      groups["This Week"].push(reminder);
    else if (due >= startOfNextWeek && due <= endOfNextWeek)
      groups["Next Week"].push(reminder);
    else groups.Later.push(reminder);
  });

  return groups;
}

export default function Reminders() {
  const userId = "68b064b22ec9458653d1cafe"; // später vom Session-User
  const { data: reminders, error } = useSWR(
    `/api/user/${userId}/reminders`,
    fetcher
  );

  const [todayReminders, setTodayReminders] = useState([]);
  const [otherReminders, setOtherReminders] = useState({});

  useEffect(() => {
    if (reminders) {
      const grouped = groupReminders(reminders);
      setTodayReminders(grouped.Today);
      const others = { ...grouped };
      delete others.Today;
      setOtherReminders(others);
    }
  }, [reminders]);

  const handleDone = (id) => {
    setTodayReminders((prev) => prev.filter((r) => r._id !== id));
  };

  if (error) return <div>Failed to load reminders: {error.message}</div>;
  if (!reminders) return <div>Loading...</div>;

  const grouped = groupReminders(reminders);

  return (
    <Container>
      <Title>Reminders</Title>

      <GroupTitle>Today</GroupTitle>
      {todayReminders.length ? (
        todayReminders.map((r) => (
          <ReminderCard
            key={r._id}
            reminder={r}
            showCheckbox
            onDone={handleDone}
          />
        ))
      ) : (
        <p>No reminders for today</p>
      )}

      {Object.entries(otherReminders).map(([groupName, items]) =>
        items.length ? (
          <div key={groupName}>
            <GroupTitle>{groupName}</GroupTitle>
            {items.map((r) => (
              <ReminderCard key={r._id} reminder={r} showCheckbox={false} />
            ))}
          </div>
        ) : null
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: var(--padding-bg-md);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const GroupTitle = styled.h2`
  margin-top: 20px;
  margin-bottom: 10px;
`;
