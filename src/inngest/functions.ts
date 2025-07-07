import { inngest } from "./client";
import { openai, createAgent, createTool, createNetwork, Tool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { PROMPT } from "@/prompt";
import prisma from "@/lib/db";

interface AgentState {
    summary: string;
    files: { [path: string]: string }
}

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
    { event: "generate-code" },
    async ({ event, step }) => {
        const sandboxId = await step.run("get-sandbox-id", async () => {
            const sandbox = await Sandbox.create("savi-test-001")
            return sandbox.sandboxId
        })
        const codeAgent = createAgent<AgentState>({
            name: "code-agent",
            system: PROMPT,
            description: "An expert coding agent",
            model: openai({
                model: "gpt-4.1", defaultParameters: {
                    temperature: 0.1
                }
            }),
            tools: [
                createTool({
                    name: "terminal",
                    description: "Use the terminal to run commands",
                    parameters: z.object({
                        command: z.string()
                    }),
                    handler: async ({ command }) => {
                        const buffer = { stdout: "", stderr: "" }
                        try {
                            const sandbox = await getSandbox(sandboxId)
                            const result = await sandbox.commands.run(command, {
                                onStdout: (data: string) => {
                                    buffer.stdout += data
                                },
                                onStderr: (data: string) => {
                                    buffer.stderr += data
                                }
                            })
                            return result.stdout

                        } catch (e) {
                            console.error(`Command failed: ${e} \nstdout: ${buffer.stdout}\nstderr: ${buffer.stderr}`)
                            return `Command failed: ${e} \nstdout: ${buffer.stdout}\nstderr: ${buffer.stderr}`
                        }

                    }
                }),
                createTool({
                    name: "createOrUpdateFiles",
                    description: "Create or update files in the sandbox.",
                    parameters: z.object({
                        files: z.array(
                            z.object({
                                path: z.string(),
                                content: z.string()
                            })
                        )
                    }),
                    handler: async ({ files }, { network }: Tool.Options<AgentState>) => {
                        try {
                            const updatedFiles = network.state.data.files || {};
                            const sandbox = await getSandbox(sandboxId)
                            for (const file of files) {
                                await sandbox.files.write(file.path, file.content)
                                updatedFiles[file.path] = file.content
                            }
                            if (typeof updatedFiles === "object" && updatedFiles !== null) {
                                network.state.data.files = updatedFiles
                            }
                            return updatedFiles
                        } catch (e) {
                            return `Error: ${e}`
                        }
                    }


                }),
                createTool({
                    name: "readFiles",
                    description: "Read files from the sandbox",
                    parameters: z.object({
                        files: z.array(z.string())
                    }),
                    handler: async ({ files }) => {
                        try {
                            const sandbox = await getSandbox(sandboxId)
                            const contents: { path: string; content: string; }[] = []
                            for (const file of files) {
                                const content = await sandbox.files.read(file);
                                contents.push({ path: file, content })
                            }
                            return JSON.stringify(contents)
                        } catch (e) {
                            return `Error: ${e}`
                        }

                    }
                })
            ],
            lifecycle: {
                onResponse: async ({ result, network }) => {
                    const lastAssistanTextMessage = lastAssistantTextMessageContent(result)

                    if (lastAssistanTextMessage && network) {
                        if (lastAssistanTextMessage.includes("<task_summary>")) {
                            network.state.data.summary = lastAssistanTextMessage
                        }

                    }
                    return result
                }
            },

        });

        const network = createNetwork<AgentState>({
            name: "coding-agent-network",
            agents: [codeAgent],
            maxIter: 15,
            router: async ({ network }) => {
                const summary = network.state.data.summary
                if (summary) {
                    return
                }
                return codeAgent
            },
        })

        const result = await step.run("Run Code Agent", async () => {
            return await network.run(event.data.value);
        });

        const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0


        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await getSandbox(sandboxId)
            const host = sandbox.getHost(3000)
            return `https://${host}`
        })

        await step?.run("save-result", async () => {
            if (isError) {
                return await prisma.message.create({
                    data: {
                        projectId: event.data.projectId,
                        content: "Something went wrong. Please try again",
                        role: "ASSISTANT",
                        type: "ERROR"
                    }
                })
            }
            return await prisma.message.create({
                data: {
                    content: result.state.data.summary,
                    role: "ASSISTANT",
                    type: "RESULT",
                    fragment: {
                        create: {
                            sandboxUrl: sandboxUrl,
                            title: "Fragment",
                            files: result.state.data.files

                        }
                    }
                }
            })
        })

        return { url: sandboxUrl, title: "Fragment", files: result.state.data.files, summary: result.state.data.summary }
    }
);
