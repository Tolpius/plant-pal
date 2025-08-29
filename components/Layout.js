import styled from "styled-components";
import Head from "next/head";
import Navbar from "./Navbar.js";
import SessionButton from "./session/SessionButton";
import { useSession } from "next-auth/react";

export default function Layout({ children }) {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Plant Pal</title>
      </Head>
      <Navbar />
      <Main>{children}</Main>
      <Navbar />
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-grow: 1;
  min-height: 100dvh;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  padding-top: 0;
  position: relative;
`;
