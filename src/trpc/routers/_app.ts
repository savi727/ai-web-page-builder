import { projectsRouter } from '@/modules/projects/server/procedures';
import { createTRPCRouter } from '../init';
import { messageRouter } from '@/modules/messages/server/procedures';

export const appRouter = createTRPCRouter(
    { message: messageRouter, projects: projectsRouter }
);

export type AppRouter = typeof appRouter;