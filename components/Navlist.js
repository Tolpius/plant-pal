import {
  BookOpenTextIcon,
  HouseIcon,
  ListIcon,
  SignInIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import styled from "styled-components";
import { signOut, signIn, useSession } from "next-auth/react";
import FunFactDisplay from "./FunFactDisplay";

export default function Navlist({
  onToggleNavlist,
  isExtendedNavList,
  session,
  currentPath,
  handleClick,
}) {
  return (
    <>
      <StyledNavlist>
        {/* The Navbar is empty except for the logo and the menu icon */}
        <Logo href={session ? "/owned" : "/"}>🌱 PlantPal</Logo>
        <NavlistButton onClick={() => onToggleNavlist()}>
          <ListIcon
            size={28}
            weight={isExtendedNavList === "true" ? "fill" : "regular"}
            aria-label="Extended Navlist"
          />
        </NavlistButton>
      </StyledNavlist>

      <ExtendedMenu>
        {!session ? (
          <NavButton
            onClick={() => signIn(undefined, { callbackUrl: "/owned" })}
          >
            <p>Login</p>
            <SignInIcon size={28} weight="regular" aria-label="Login" />
          </NavButton>
        ) : (
          <>
            <NavLink onClick={() => onToggleNavlist()} href="/owned">
              <StyledText>Home</StyledText>
              <HouseIcon
                size={28}
                weight={currentPath === "/owned" ? "fill" : "regular"}
                aria-label="My Plants"
              />
            </NavLink>

            <NavLink onClick={() => onToggleNavlist()} href="/catalogue">
              <StyledText>Catalogue</StyledText>
              <BookOpenTextIcon
                size={28}
                weight={currentPath === "/catalogue" ? "fill" : "regular"}
                aria-label="Catalogue"
              />
            </NavLink>

            <NavButton>
              <FunFactDisplay
                isExtendedNavList={isExtendedNavList}
                onClick={() => handleClick()}
                size={26}
                aria-label="Fun Facts"
              />
            </NavButton>

            <NavButton onClick={() => signOut({ callbackUrl: "/" })}>
              Log Out{" "}
              <SignOutIcon size={26} weight="regular" aria-label="Logout" />
            </NavButton>
          </>
        )}
      </ExtendedMenu>
    </>
  );
}

// ================= Styled Components =================

const StyledNavlist = styled.nav`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--color-primary);
  border-bottom: 1px solid var(--color-neutral-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-weight: bold;
  font-size: 1.25rem;
  text-decoration: none;
  &:visited {
    color: inherit;
  }
`;

const ExtendedMenu = styled.div`
  display: flex;
  padding: 12px 22px;
  gap: 1rem;
  flex-direction: column;
  background-color: var(--color-primary);
  height: auto;
  justify-content: right;
  font-size: var(--font-size-md);
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: end;
  color: var(--color-secondary);
  transition: color 0.2s ease-in-out;
  text-decoration: none;
  font-size: var(--font-size-lg);
  &:hover {
    color: var(--color-black);
  }
  border-bottom: 1px solid var(--color-neutral-dark);
`;

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
const NavlistButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: end;

  background: transparent;
  border: none;
  color: var(--color-secondary);
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--color-black);
  }
`;

const StyledText = styled.p`
  padding: 0px, 25px;
  font-size: var(--font-size-lg);
`;
