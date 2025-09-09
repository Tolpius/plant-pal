import { useSession } from "next-auth/react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import styled from "styled-components";

export default function DarkMode({ onToggleNavlist }) {
  const { data: session, update } = useSession();
  const isDarkMode = session.user.isDarkMode;
  const userId = session.user.id;

  //this way we can call two functions on the onClick of the DarkModeButton
  //1. changing the DarkMode and 2. also closing the NavList
  function handlerTwoFunctions() {
    toggleDarkMode();
    onToggleNavlist();
  }

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
      <NavButton onClick={handlerTwoFunctions}>
        {isDarkMode ? "Light Mode" : "Dark Mode"}
        {isDarkMode ? (
          <SunIcon size={28} weight="regular" aria-label="turn dark mode off" />
        ) : (
          <MoonIcon size={28} weight="regular" aria-label="turn dark mode on" />
        )}
      </NavButton>
    </>
  );
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
  &:hover {
    color: var(--color-black);
  }
`;
