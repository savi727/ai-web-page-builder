"use client"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { MessagesContainer } from "../components/messages-container"
import { Suspense, useState } from "react"
import { Fragment } from "@/generated/prisma"
import { ProjectHeader } from "../components/project-header"
import { FragmentWeb } from "../components/fragment-web"
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeView } from "@/components/code-view"
import { FileExplorer } from "@/components/custom/file-explorer"

interface Props {
    projectId: string
}

export const ProjectView = ({ projectId, }: Props) => {
    const [tabState, setTabState] = useState<"preview" | "code">("preview")
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
    return <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-screen">
                <Suspense fallback={<p>Loading Project.............</p>}>
                    <ProjectHeader projectId={projectId} />
                </Suspense>
                <Suspense fallback={<p>Loading Messages............</p>}>
                    <MessagesContainer
                        projectId={projectId}
                        activeFragement={activeFragment}
                        setActiveFragment={setActiveFragment}
                    />
                </Suspense>
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={65} minSize={50}>
                <Tabs
                    className="h-full gap-y-0"
                    defaultValue="preview"
                    value={tabState}
                    onValueChange={(value) => setTabState(value as "preview" | "code")}
                >
                    <div className="w-full flex items-center p-2 border-b gap-x-2">
                        <TabsList className="h-8 p-0 border rounded-md">
                            <TabsTrigger value="code" className="rounded-md">
                                <CodeIcon /> <span>Code</span>
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="rounded-md">
                                <EyeIcon /> <span>Demo</span>
                            </TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-x-2" >
                            <Button asChild size="sm" variant={"default"}>
                                <Link href="/pricing">
                                    <CrownIcon /> Upgrade
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <TabsContent value="code">
                        {!!activeFragment?.files && (
                            <FileExplorer
                                files={activeFragment.files as { [path: string]: string }}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="preview">
                        {activeFragment && <FragmentWeb data={activeFragment} />}
                    </TabsContent>
                </Tabs>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
}