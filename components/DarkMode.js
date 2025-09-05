import { useSession } from "next-auth/react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import useSWR from "swr";
import styled from "styled-components";

export default function DarkMode() {
  const { data: session } = useSession();
  console.log("session: ", session.user.id);
  const isDarkMode = session.user.isDarkMode;
  const userId = session.user.id;
  console.log("isDarkMode: ", isDarkMode);

  /* if clicked toggle isDarkmode
    if is Dakr Mode is true set body dark(add a new class) on body dark
    dark on body uses new variables which are dark (duh!) */
  //WHERE DO I GET THE USER ID FROM? not query, thats the slug of whereever we are at..
  //const { data: user, isLoading, error } = useSWR(`/api/user/${userId}`);

  async function toggleDarkMode() {
    // <-- needs the updated user here!!
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

      const updatedUser = await response.json();
      console.log("User edited successfully:", updatedUser);
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
        Dark Mode / Light Mode
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
  border-bottom: 1px solid var(--color-neutral-dark);
  &:hover {
    color: var(--color-black);
  }
`;
