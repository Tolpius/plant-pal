import { useSession } from "next-auth/react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import styled from "styled-components";
import { useEffect } from "react";

export default function DarkMode() {
  const { data: session, update } = useSession();
  const isDarkMode = session.user.isDarkMode;
  const userId = session.user.id;

  async function toggleDarkMode() {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDarkMode: !session.user.isDarkMode }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to edit Dark Mode in User: ${response.statusText}`
        );
      }
      update();
    } catch (error) {
      console.error("Error changing User:", error);
      alert("Failed to change User. Please try again.");
    }
  }

  return (
    <>
      <NavButton onClick={toggleDarkMode}>
        {isDarkMode ? (
          <SunIcon size={32} weight="regular" aria-label="turn dark mode off" />
        ) : (
          <MoonIcon size={32} weight="regular" aria-label="turn dark mode on" />
        )}
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </NavButton>
    </>
  );
}

//This is used in the Layout Component
export function DarkModeHandler() {
  const { data: session } = useSession();

  const isDarkMode = session?.user?.isDarkMode;

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);
}

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: end;
  background: transparent;
  border: none;
  font-size: var(--font-size-lg);
  padding: 0;
  color: var(--color-secondary);
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  border-bottom: 1px solid var(--color-neutral-dark);
  &:hover {
    color: var(--color-black);
  }
`;
