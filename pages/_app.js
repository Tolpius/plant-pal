import Layout from "@/components/Layout";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";

async function fetcher(resource, init) {
  const response = await fetch(resource, init);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");

    try {
      error.info = await response.json();
    } catch {
      error.info = null;
    }

    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{ fetcher: fetcher }}>
        <Layout>
          <GlobalStyle />
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </SessionProvider>
  );
}
