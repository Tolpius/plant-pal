import styled from "styled-components";
import Head from "next/head";
import Headline from "./Headline";
import Navbar from "./Navbar.js";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Plant Pal</title>
      </Head>
      <Headline>Plant Pal</Headline>
      <Main>{children}</Main>
      {/* <Navbar /> */}
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
