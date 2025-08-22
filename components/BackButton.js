import Link from "next/link";
import styled from "styled-components";
import { ArrowCircleLeftIcon } from "@phosphor-icons/react";

export default function BackButton() {
  return (
    <StyledBackButton href={"/"}>
      <ArrowCircleLeftIcon size={32} />
    </StyledBackButton>
  );
}

const StyledBackButton = styled(Link)`
  text-decoration: none;
`;
