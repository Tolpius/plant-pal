import styled from "styled-components";
import Head from "next/head";
import Headline from "./Headline";
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
      {session && <Navbar />}
     {!session && <SessionButton/>}
      <Headline>Plant Pal</Headline>
      <Main>{children}</Main>
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
