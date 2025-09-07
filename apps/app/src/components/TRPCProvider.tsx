import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { trpc } from "../lib/trpc";

const getBaseUrl = () => {
  return `${import.meta.env.VITE_API_URL || "http://localhost:3002"}`;
};

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          headers: async () => {
            const {
              data: { session },
            } = await supabase.auth.getSession();

            return {
              "x-token": session?.access_token ? `${session.access_token}` : "",
            };
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}
