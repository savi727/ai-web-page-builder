import { createTRPCRouter } from '../init';
import { messageRouter } from '@/modules/messages/server/procedures';

export const appRouter = createTRPCRouter(
    { message: messageRouter }
);

export type AppRouter = typeof appRouter;