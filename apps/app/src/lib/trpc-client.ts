import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../api/src/router";
import { supabase } from "./supabase";

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      // API URL from environment variable, fallback to localhost for development
      url: `${import.meta.env.VITE_API_URL || "http://localhost:3002"}/trpc`,
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
});
