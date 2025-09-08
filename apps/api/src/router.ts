import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { boardRouter } from "./routers/board";
import { clientRouter } from "./routers/client";
import { connectionRouter } from "./routers/connection";

export const appRouter = router({
  user: userRouter,
  board: boardRouter,
  client: clientRouter,
  connection: connectionRouter,
});

export type AppRouter = typeof appRouter;
