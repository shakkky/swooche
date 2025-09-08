import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { boardRouter } from "./routers/board";
import { clientRouter } from "./routers/client";

export const appRouter = router({
  user: userRouter,
  board: boardRouter,
  client: clientRouter,
});

export type AppRouter = typeof appRouter;
