import {
  BookOpenTextIcon,
  CalendarIcon,
  HeartIcon,
  HouseIcon,
  LightbulbIcon,
  ListIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";
import { signOut } from "next-auth/react";
import FunFactDisplay from "./FunFact";

export default function Navbar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <StyledNavbar>
      <NavLink href="/owned">
        <HouseIcon
          className="icon"
          size={28}
          weight={currentPath === "/owned" ? "fill" : "regular"}
          aria-label="My Plants"
        />
      </NavLink>
      <NavLink href="/catalogue">
        <BookOpenTextIcon
          className="icon"
          size={28}
          weight={currentPath === "/catalogue" ? "fill" : "regular"}
          aria-label="Owned plant list"
        />
      </NavLink>
      <NavItem>
        <FunFactDisplay
          size={28}
          weight={currentPath === "/owned" ? "fill" : "regular"}
          aria-label="Owned plant list"
        />
      </NavItem>
      <NavButton onClick={() => signOut({ callbackUrl: "/" })}>
        <SignOutIcon
          className="icon"
          size={28}
          weight="regular"
          aria-label="Owned plant list"
        />
      </NavButton>{" "}
      <NavButton href="/owned">
        <ListIcon
          className="icon"
          size={28}
          weight={currentPath === "/owned" ? "fill" : "regular"}
          aria-label="Owned plant list"
        />
      </NavButton>
    </StyledNavbar>
  );
}

const StyledNavbar = styled.nav`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  z-index: 1000;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  transition: color 0.2s ease-in-out;
  padding: 0;

  &:hover {
    color: #000;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: transparent;
  color: #444;
  transition: color 0.2s ease-in-out;
  padding: 0;
  &:hover {
    color: #000;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  transition: color 0.2s ease-in-out;
  padding: 0;
  &:hover {
    color: #000;
  }
`;
