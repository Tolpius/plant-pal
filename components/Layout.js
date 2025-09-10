import styled from "styled-components";
import Head from "next/head";
import Navbar from "./Navbar.js";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Navlist from "./Navlist.js";
import { useRouter } from "next/router.js";
import { ToastContainer } from "react-toastify";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const currentPath = router.pathname;

  const [isExtendedNavList, setIsExtendedNavList] = useState(false);

  function onToggleNavlist() {
    setIsExtendedNavList(!isExtendedNavList);
  }

  return (
    <>
      <Head>
        <title>Plant Pal</title>
      </Head>
      {isExtendedNavList ? (
        <Navlist
          onToggleNavlist={onToggleNavlist}
          isExtendedNavList={isExtendedNavList}
          session={session}
          currentPath={currentPath}
          role="navigation"
          aria-label="Main navigation"
        />
      ) : (
        <Navbar
          onToggleNavlist={onToggleNavlist}
          isExtendedNavList={isExtendedNavList}
          session={session}
          currentPath={currentPath}
          aria-label="Main navigation"
        />
      )}
      <Main>{children}</Main>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
