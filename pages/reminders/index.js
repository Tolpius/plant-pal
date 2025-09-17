import useSWR, { mutate } from "swr";
import styled from "styled-components";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import ReminderCard from "@/components/reminder/ReminderCard";
import { PlusCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";

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
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: reminders, error } = useSWR(
    userId ? `/api/user/${userId}/reminders` : null
  );

  const { data: plants, error: plantsError } = useSWR(
    userId ? `/api/user/${userId}/owned` : null
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
  if (plantsError) return <div>Failed to load plants</div>;
  if (!reminders) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <Title>Reminders</Title>
        <StyledLink href="/reminders/add" aria-label="create reminder">
          <AddIcon size={32} />
        </StyledLink>
      </Header>

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
        <StyledNoReminderMessage>
          No reminders for tomorrow
        </StyledNoReminderMessage>
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Title = styled.h1`
  text-align: center;
  color: var(--color-neutral-base);
`;

const StyledLink = styled(Link)`
  color: var(--color-neutral-base);
  cursor: pointer;
`;

const AddIcon = styled(PlusCircleIcon)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const GroupTitle = styled.h2`
  margin-top: 20px;
  margin-bottom: 10px;
  color: var(--color-neutral-base);
`;

const StyledNoReminderMessage = styled.p`
  color: var(--color-neutral-base);
`;
