import styled from "styled-components";
import Head from "next/head";
import TitleBar from "./TitleBar";

const Main = styled.main`
  display: grid;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1.5rem;
  position: relative;
  width: 100%;
`;

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Plant Pal</title>
      </Head>
      <TitleBar />
      <Main>{children}</Main>
    </>
  );
}
