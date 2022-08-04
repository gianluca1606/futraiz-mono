import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import superjson from "superjson";
import { AppRouter } from "../server/route/app.router";
import { url } from "../constants";
import { trpc } from "../utils/trpc";
import { UserContextProvider } from "../context/user.context";
import { Head } from "next/document";
import Script from "next/script";
import { NextSeo } from "next-seo";

function MyApp({ Component, pageProps }: AppProps) {
  const { data, error, isLoading } = trpc.useQuery(["users.me"]);
  if (isLoading) {
    return <p>Loading user</p>;
  }

  return (
    <>
      <NextSeo
        title="Dream Activies"
        description="A short description goes here."
      />
      <UserContextProvider value={data}>
        {" "}
        <main>
          <Component {...pageProps} />
        </main>
      </UserContextProvider>
    </>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url,
      }),
    ];
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
          },
        },
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            "x-ssr": "1",
          };
        }
        return {};
      },
      links,
      transformer: superjson,
    };
  },
  ssr: false,
})(MyApp);
