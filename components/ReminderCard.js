import styled from "styled-components";
import { useState } from "react";

export default function ReminderCard({ reminder }) {
  const [done, setDone] = useState(false);

  const handleCheckboxChange = () => {
    setDone(!done);
  };

  return (
    <Card done={done}>
      <Image src={reminder.plantId.imageUrl} alt={reminder.plantId.name} />
      <Content>
        <h3>{reminder.plantId.name}</h3>
        <p>
          <strong>Task:</strong> {reminder.title}
        </p>
        <p>
          <strong>Description:</strong> {reminder.description}
        </p>
        <p>
          <strong>Due:</strong>{" "}
          {new Date(reminder.dueDate).toLocaleDateString()}
        </p>
      </Content>
      <CheckboxContainer>
        <input type="checkbox" checked={done} onChange={handleCheckboxChange} />
      </CheckboxContainer>
    </Card>
  );
}

const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  gap: 10px;
  align-items: center;
  background-color: ${({ done }) => (done ? "#e0ffe0" : "#fff")};
  opacity: ${({ done }) => (done ? 0.6 : 1)};
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const Content = styled.div`
  flex: 1;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
