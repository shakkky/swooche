import { User } from "@swooche/schemas";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions): Promise<{ req: any; res: any }> => ({
  req,
  res,
});

export type PublicContext = Awaited<ReturnType<typeof createContext>> & {
  user?: User;
  supabaseUserId?: string;
};

// a token has been verified and placed in ctx.token
// any user data associated with that token has not been loaded into ctx yet.
// Practically, this is when no user data exists yet, like when a user has just signed up with oauth
export type VerifiedTokenContext = RequiredFields<
  PublicContext,
  "supabaseUserId"
>;

export type ProtectedContext = Required<PublicContext>;
