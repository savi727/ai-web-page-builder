import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("Start the Video Decoding", "10s");
        await step.sleep("Gnerate the summary", "20s");
        await step.sleep("Send summary to user", "10s");
        return { message: `Hello ${event.data.value}!` };
    },
);

export const agent = inngest.createFunction(
    { id: "summarize-contents" },
    { event: "app/ticket.created" },
    async ({ event, step }) => {

        const summeriser = createAgent({
            name: "summarizer",
            system: "You are an expert Summarizer. Please summarize in 2 words ",
            model: openai({ model: "gpt-4.1" }),
        });

        const { output } = await summeriser.run(`Summarize the following text: ${event.data.value}`);

        return output
    }
);