import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from "./layout";

const queryClient = new QueryClient();

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const isBackoffice = router.pathname.startsWith('/backoffice');

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {isBackoffice ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}
