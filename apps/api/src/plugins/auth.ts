import { UserModel } from "@swooche/models";
import { initTRPC, TRPCError } from "@trpc/server";
import { supabase } from "../supabase";
import { PublicContext, VerifiedTokenContext } from "../context";

export function createAuthPlugin() {
  const tPublicContext = initTRPC.context<PublicContext>().create();
  const tVerifiedTokenContext = initTRPC
    .context<VerifiedTokenContext>()
    .create();

  return {
    verifiedTokenProcedure: tPublicContext.procedure.use(
      async ({ ctx, next }) => {
        const idToken = ctx.req.headers["x-token"] as string;
        if (!idToken) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const { data, error } = await supabase.auth.getUser(idToken);
        if (error || !data.user) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        return next({ ctx: { ...ctx, supabaseUserId: data.user.id } });
      }
    ),
    loadUserProcedure: tVerifiedTokenContext.procedure.use(
      async ({ ctx, next }) => {
        if (!ctx.supabaseUserId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const dbUser = await UserModel.findOne({
          supabaseUserId: ctx.supabaseUserId,
        })
          .lean()
          .orFail(new TRPCError({ code: "UNAUTHORIZED" }));

        return next({
          ctx: {
            ...ctx,
            user: dbUser,
          },
        });
      }
    ),
  };
}
