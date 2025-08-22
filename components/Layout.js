import styled from "styled-components";
import Head from "next/head";
import Headline from "./Headline";

const Main = styled.main`
  display: grid;
  gap: 0.5rem;
  padding: 1.5rem;
  padding-top: 0;
  position: relative;
`;

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Plant Pal</title>
      </Head>
      <Headline>Plant Pal</Headline>
      <Main>{children}</Main>
    </>
  );
}
