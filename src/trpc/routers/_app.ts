import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { inngest } from '@/inngest/client';
export const appRouter = createTRPCRouter({
    invoke: baseProcedure.input(z.object({ value: z.string() })).mutation(
        async ({ input }) => {
            await inngest.send({
                name: "app/ticket.created",
                data: {
                    "value": input.value
                }
            })
            return { "ok": "success" }
        }
    ),
    hello: baseProcedure
        .input(
            z.object({
                value: z.string(),
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

                greeting: `hello ${opts.input.value}`,
            };
        }),
});

export type AppRouter = typeof appRouter;