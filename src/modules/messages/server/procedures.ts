import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const messageRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        const message = await prisma.message.findMany({
            orderBy: {
                updatedAt: "desc"
            }
        })
        return message

    }),
    create: baseProcedure.input(
        z.object({
            value: z.string().min(1, { message: "Message is Required" })
        })
    ).mutation(async ({ input }) => {
        const createdMessage = await prisma.message.create({
            data: {
                content: input.value,
                role: "USER",
                type: "RESULT"
            }
        })

        await inngest.send({
            name: "generate-code",
            data: {
                "value": input.value
            }
        })

        return createdMessage


    })
})