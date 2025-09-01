import {
  BookOpenTextIcon,
  HouseIcon,
  ListIcon,
  SignInIcon,
  SignOutIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { signOut, signIn, useSession } from "next-auth/react";
import FunFactDisplay from "./FunFact";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <StyledNavbar>
      {/* Linke Seite: Logo oder leer */}
      <Logo href={session ? "/owned" : "/"}>🌱 PlantPal</Logo>

      {/* Rechte Seite */}
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
              <FunFactDisplay
                size={28}
                weight={currentPath === "/owned" ? "fill" : "regular"}
                aria-label="Fun Facts"
              />
            </NavItem>

            <NavButton onClick={() => signOut({ callbackUrl: "/" })}>
              <SignOutIcon size={28} weight="regular" aria-label="Logout" />
            </NavButton>

            <NavButton as={Link} href="/owned">
              <ListIcon
                size={28}
                weight={currentPath === "/owned" ? "fill" : "regular"}
                aria-label="Owned Plants"
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
  background: var(--color-green-500);
  border-bottom: 1px solid #e5e5e5;
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

const RightMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-beige-100);
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #000;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-beige-100);
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #000;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-beige-100);
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #000;
  }
`;
