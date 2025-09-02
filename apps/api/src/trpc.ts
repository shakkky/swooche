import type { PublicContext } from "./context";
import { initTRPC } from "@trpc/server";

const createTRPC = () => initTRPC.context<PublicContext>();

const trpc = createTRPC();
export const t = trpc.create();
export const router = t.router;
