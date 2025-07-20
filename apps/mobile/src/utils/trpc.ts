import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../api/src/router";

// Configure your server URL here
// const SERVER_URL = __DEV__
//   ? "http://192.168.8.131:3001"
//   : "https://api.swooche.com";

const SERVER_URL = "https://api.swooche.com";

// Create a tRPC client
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${SERVER_URL}/trpc`,
    }),
  ],
});
