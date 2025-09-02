import { createAuthPlugin } from "./plugins/auth";
import { t } from "./trpc";

const authPlugin = createAuthPlugin();

export const publicProcedure = t.procedure;
export const tokenOnlyProcedure = t.procedure.concat(
  authPlugin.verifiedTokenProcedure
);
export const protectedProcedure = t.procedure
  .concat(authPlugin.verifiedTokenProcedure)
  .concat(authPlugin.loadUserProcedure);
