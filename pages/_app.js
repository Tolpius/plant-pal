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
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    navigator.serviceWorker
      .register("/sw.js")

      .catch((error) => console.error("SW-Fehler:", error));

    const onLoad = () => {
      ensurePushSubscription();
    };
    const onFocus = () => {
      ensurePushSubscription();
    };

    window.addEventListener("load", onLoad);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("focus", onFocus);
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
