import styled from "styled-components";
import { useState } from "react";

export default function ReminderCard({ reminder, showCheckbox, onDone }) {
  const handleCheckboxChange = async () => {
    try {
      const res = await fetch(`/api/reminders/${reminder._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (onDone) onDone(reminder._id);
      } else {
        console.error("Failed to delete reminder");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <Image src={reminder.plantId.imageUrl} alt={reminder.plantId.name} />
      <Content>
        <h3>{reminder.plantId.name}</h3>
        <p>
          <Label>Task:</Label> {reminder.title}
        </p>
        <p>
          <Label>Description:</Label> {reminder.description}
        </p>
        <p>
          <Label>Due:</Label> {new Date(reminder.dueDate).toLocaleDateString()}
        </p>
      </Content>
      {showCheckbox && (
        <CheckboxContainer>
          <input type="checkbox" onChange={handleCheckboxChange} />
        </CheckboxContainer>
      )}
    </Card>
  );
}

const Card = styled.div`
  border: var(--border-sm-dark);
  padding: var(--padding-bg-sm);
  margin-bottom: 10px;
  border-radius: var(--radius-md);
  display: flex;
  gap: 10px;
  align-items: center;
  background-color: var(--color-white);
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
`;

const Content = styled.div`
  flex: 1;
`;

const Label = styled.span`
  font-weight: bold;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
