import { inngest } from "./client";
import { openai, createAgent } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter"
import { getSandboxUrl } from "./utils";

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
    { id: "code-agent" },
    { event: "app/ticket.created" },
    async ({ event, step }) => {

        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("savi-test-template")
            return sandbox.sandboxId
        })

        const codeAgent = createAgent({
            name: "code-agent",
            system: "You are a profesisonal developer. Write the scalable, modular & maintainable code",
            model: openai({ model: "gpt-4.1" }),
        });

        const { output } = await codeAgent.run(`${event.data.value}`);
        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await getSandboxUrl(sandboxId)
            const host =  sandbox.getHost(3000)
            return `https://${host}`
        })

        return {output, sandboxUrl}
    }
);