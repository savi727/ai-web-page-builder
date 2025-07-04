import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("Start the Video Decoding", "10s");
        await step.sleep("Gnerate the summary", "20s");
        await step.sleep("Send summary to user", "10s");
        return { message: `Hello ${event.data.email}!` };
    },
);
