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
      <Logo href={session ? "/owned" : "/"} aria-label="Home">
        🌱 PlantPal
      </Logo>

      {/* Right side Menu */}
      <RightMenu>
        {!session ? (
          <NavButton
            onClick={() => signIn(undefined, { callbackUrl: "/owned" })}
            aria-label="Login"
          >
            <p>Login</p>
            <SignInIcon size={28} weight="regular" />
          </NavButton>
        ) : (
          <>
            <NavLink href="/owned" aria-label="My Plants">
              <HouseIcon
                size={28}
                weight={currentPath === "/owned" ? "fill" : "regular"}
              />
            </NavLink>

            <NavLink href="/catalogue" aria-label="Catalogue">
              <BookOpenTextIcon
                size={28}
                weight={currentPath === "/catalogue" ? "fill" : "regular"}
              />
            </NavLink>

            <NavItem aria-label="Fun Facts">
              <FunFactDisplay  />
            </NavItem>

            <NavButton
              onClick={() => onToggleNavlist()}
              aria-label="Toggle Extended Navlist"
            >
              <ListIcon
                size={28}
                weight={isExtendedNavList === "true" ? "fill" : "regular"}
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
  color: var(--color-black);
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
