import useSWR from "swr";
import styled from "styled-components";
import ReminderCard from "@/components/ReminderCard";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Reminders() {
  const userId = "68b064b22ec9458653d1cafe"; // später vom Session-User
  const { data: reminders, error } = useSWR(
    `/api/user/${userId}/reminders`,
    fetcher
  );

  if (error) return <div>Failed to load reminders: {error.message}</div>;
  if (!reminders) return <div>Loading...</div>;

  return (
    <Container>
      <Title>Reminders</Title>
      {reminders.map((reminder) => (
        <ReminderCard key={reminder._id} reminder={reminder} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
`;
