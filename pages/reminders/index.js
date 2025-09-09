import useSWR, { mutate } from "swr";
import styled from "styled-components";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

import ReminderCard from "@/components/reminder/ReminderCard";

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

    if (due <= today) groups.Today.push(reminder);
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
  const { data: session } = useSession();
  const userId = session?.user?.id; // später vom Session-User
  const { data: reminders, error } = useSWR(
    userId ? `/api/user/${userId}/reminders` : null,
    fetcher
  );

  const groupedReminders = useMemo(
    () => (reminders ? groupReminders(reminders) : {}),
    [reminders]
  );

  const {
    Today: todayReminders = [],
    Tomorrow: tomorrowReminders = [],
    ...otherReminders
  } = groupedReminders || {};

  const handleDone = async (id) => {
    // Optimistic update
    mutate(
      `/api/user/${userId}/reminders`,
      (prev) => prev.filter((reminder) => reminder._id !== id),
      false
    );
  };

  if (error) return <div>Failed to load reminders: {error.message}</div>;
  if (!reminders) return <div>Loading...</div>;

  return (
    <Container>
      <Title>Reminders</Title>

      <GroupTitle>Today</GroupTitle>
      {todayReminders.length ? (
        todayReminders.map((reminder) => (
          <ReminderCard
            key={reminder._id}
            reminder={reminder}
            showCheckbox
            onDone={handleDone}
            userId={userId}
          />
        ))
      ) : (
        <p>No reminders for today</p>
      )}

      <GroupTitle>Tomorrow</GroupTitle>
      {tomorrowReminders.length ? (
        tomorrowReminders.map((reminder) => (
          <ReminderCard
            key={reminder._id}
            reminder={reminder}
            showCheckbox
            onDone={handleDone}
            userId={userId}
          />
        ))
      ) : (
        <p>No reminders for tomorrow</p>
      )}

      {Object.entries(otherReminders).map(([groupName, items]) =>
        items.length ? (
          <div key={groupName}>
            <GroupTitle>{groupName}</GroupTitle>
            {items.map((reminder) => (
              <ReminderCard key={reminder._id} reminder={reminder} />
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
