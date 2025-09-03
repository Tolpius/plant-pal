import {
  BookOpenTextIcon,
  HouseIcon,
  ListIcon,
  SignInIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import styled from "styled-components";

import { signIn } from "next-auth/react";
import FunFactDisplay from "./FunFactDisplay";

export default function Navbar({
  onToggleNavlist,
  isExtendedNavList,
  session,
  currentPath,
}) {
  return (
    <StyledNavbar>
      {/* Logo on the left side */}
      <Logo href={session ? "/owned" : "/"}>🌱 PlantPal</Logo>

      {/* Right side Menu */}
      <RightMenu>
        {!session ? (
          <NavButton
            onClick={() => signIn(undefined, { callbackUrl: "/owned" })}
          >
            <p>Login</p>
            <SignInIcon size={28} weight="regular" aria-label="Login" />
          </NavButton>
        ) : (
          <>
            <NavLink href="/owned">
              <HouseIcon
                size={28}
                weight={currentPath === "/owned" ? "fill" : "regular"}
                aria-label="My Plants"
              />
            </NavLink>

            <NavLink href="/catalogue">
              <BookOpenTextIcon
                size={28}
                weight={currentPath === "/catalogue" ? "fill" : "regular"}
                aria-label="Catalogue"
              />
            </NavLink>

            <NavItem>
              <FunFactDisplay aria-label="Fun Facts" />
            </NavItem>

            <NavButton onClick={() => onToggleNavlist()}>
              <ListIcon
                size={28}
                weight={isExtendedNavList === "true" ? "fill" : "regular"}
                aria-label="Extended Navlist"
              />
            </NavButton>
          </>
        )}
      </RightMenu>
    </StyledNavbar>
  );
}

// ================= Styled Components =================

const StyledNavbar = styled.nav`
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
  z-index: 10;
`;

const Logo = styled(Link)`
  font-weight: bold;
  font-size: 1.25rem;
  text-decoration: none;
  &:visited {
    color: inherit;
  }
`;

const RightMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-secondary);
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--color-black);
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--color-black);
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--color-black);
  }
`;
