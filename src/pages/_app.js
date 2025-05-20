import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from "./layout";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}
