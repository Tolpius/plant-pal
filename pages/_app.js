import Layout from "@/components/Layout";
import GlobalStyle from "../styles";
import { SWRConfig } from "swr";
export default function App({ Component, pageProps }) {
  return (
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
  );
}
