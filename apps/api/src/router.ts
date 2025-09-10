import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { boardRouter } from "./routers/board";
import { clientRouter } from "./routers/client";
import { connectionRouter } from "./routers/connection";
import { taskRouter } from "./routers/task";

export const appRouter = router({
  user: userRouter,
  board: boardRouter,
  clients: clientRouter,
  connection: connectionRouter,
  tasks: taskRouter,
});

export type AppRouter = typeof appRouter;
