import { normalisePlantData } from "@/utils/plantHelpers";
import { GearIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import styled from "styled-components";

export default function ReminderCard({
  reminder,
  showCheckbox,
  onDone,
  userId,
}) {
  const handleCheckboxChange = async () => {
    try {
      const response = await fetch(
        `/api/user/${userId}/reminders/${reminder._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        if (onDone) onDone(reminder._id);
      } else {
        console.error("Failed to delete reminder");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const plant = normalisePlantData(reminder.plantId);

  return (
    <Card>
      <Image src={plant.imageUrl} alt={plant.name} />
      <Content>
        <h3>{plant.nickname || plant.name}</h3>
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
      <StyledLink href={`reminders/${reminder._id}`}>
        <GearIcon size={28} />
      </StyledLink>
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
  position: relative;
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

const StyledLink = styled(Link)`
  position: absolute;
  top: -10px;
  left: -10px;
  background-color: var(--color-white);
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  color: var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-primary);
  }
`;
