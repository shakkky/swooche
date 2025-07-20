import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router";

// Create a tRPC client
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/trpc",
    }),
  ],
});

// Example usage
async function example() {
  try {
    // Get token
    const tokenData = await trpc.getToken.query();
    console.log("Token:", tokenData);

    // Update agent status
    await trpc.updateAgentStatus.mutate({
      identity: "Shakeel",
      status: "ready",
    });

    // Get agent status
    const status = await trpc.getAgentStatus.query({ identity: "Shakeel" });
    console.log("Agent status:", status);

    // Get all agent statuses
    const allStatuses = await trpc.getAllAgentStatuses.query();
    console.log("All agent statuses:", allStatuses);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Uncomment to run the example
// example();
