import { useEffect } from "react";
import Layout from "@/components/Layout";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import { ensurePushSubscription } from "@/lib/notifications";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker
      .register("/sw.js")
      .catch((error) => console.error("SW-Fehler:", error));

    window.addEventListener("load", ensurePushSubscription);
    window.addEventListener("focus", ensurePushSubscription);
    return () => {
      window.removeEventListener("load", ensurePushSubscription);
      window.removeEventListener("focus", ensurePushSubscription);
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <GlobalStyle />
      <SWRConfig
        value={{
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
