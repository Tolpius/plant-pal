import { HeartIcon, HouseIcon, PlusCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <StyledNavbar>
      <NavItem href="/">
        <HouseIcon
          size={28}
          weight={currentPath === "/" ? "fill" : "regular"}
        />
      </NavItem>
      <NavItem href="/add">
        <PlusCircleIcon
          size={28}
          weight={currentPath === "/add" ? "fill" : "regular"}
        />
      </NavItem>
      <NavItem href="/owned">
        <HeartIcon
          size={28}
          weight={currentPath === "/owned" ? "fill" : "regular"}
        />
      </NavItem>
    </StyledNavbar>
  );
}

const StyledNavbar = styled.nav`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  z-index: 1000;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #000;
  }
`;
