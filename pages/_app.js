import { useEffect } from "react";
import Layout from "@/components/Layout";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("SW registriert:", reg);
      })
      .catch((err) => console.error("SW-Fehler:", err));
  }, []);

  return (
    <SessionProvider session={session}>
      <GlobalStyle />
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (resource, init) =>
            fetch(resource, init).then((response) => response.json()),
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </SessionProvider>
  );
}
