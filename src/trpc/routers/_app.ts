import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
    hello: baseProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query(async (opts) => {
            await (async () => {
                return new Promise((res) => {
                    setTimeout(() => {
                        res("Resolved")
                    }, 2000)
                })
            })()
            return {

                greeting: `hello ${opts.input.text}`,
            };
        }),
});

export type AppRouter = typeof appRouter;