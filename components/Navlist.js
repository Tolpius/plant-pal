import {
  BookOpenTextIcon,
  HouseIcon,
  ListIcon,
  SignInIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import styled from "styled-components";
import { signOut, signIn } from "next-auth/react";
import FunFactDisplay from "./FunFactDisplay";

export default function Navlist({
  onToggleNavlist,
  isExtendedNavList,
  session,
  currentPath,
}) {
  return (
    <>
      <StyledNavlist>
        {/* The Navbar is empty except for the logo and the menu icon */}
        <Logo href="/" aria-label="Home">
          🌱 PlantPal
        </Logo>
        <NavlistButton
          onClick={() => onToggleNavlist()}
          aria-label="Toggle Extended Navlist"
        >
          <ListIcon
            size={28}
            weight={isExtendedNavList === "true" ? "fill" : "regular"}
          />
        </NavlistButton>
      </StyledNavlist>

      <ExtendedMenu>
        <NavLink
          onClick={() => onToggleNavlist()}
          href="/owned"
          aria-label="My Plants"
        >
          <StyledText>Home</StyledText>
          <HouseIcon
            size={28}
            weight={currentPath === "/owned" ? "fill" : "regular"}
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

        <NavButton aria-label="Fun Facts">
          <FunFactDisplay isExtendedNavList={isExtendedNavList} size={26} />
        </NavButton>

        <NavButton
          onClick={() => signOut({ callbackUrl: "/" })}
          aria-label="Logout"
        >
          Log Out
          <SignOutIcon size={26} weight="regular" />
        </NavButton>
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
