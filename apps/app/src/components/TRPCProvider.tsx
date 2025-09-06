import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "../lib/trpc";
import { supabase } from "../lib/supabase";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // API URL from environment variable, fallback to localhost for development
          url: `${
            import.meta.env.VITE_API_URL || "http://localhost:3002"
          }/trpc`,
          headers: async () => {
            // Get the session token from Supabase
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
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
