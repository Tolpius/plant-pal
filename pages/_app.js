import Layout from "@/components/Layout";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (resource, init) =>
            fetch(resource, init).then((response) => response.json()),
        }}
      >
        <Layout>
          <GlobalStyle />
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </SessionProvider>
  );
}