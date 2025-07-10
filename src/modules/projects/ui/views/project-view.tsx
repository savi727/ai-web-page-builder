"use client"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { MessagesContainer } from "../components/messages-container"
import { Suspense, useState } from "react"
import { Fragment } from "@/generated/prisma"


interface Props {
    projectId: string
}

export const ProjectView = ({ projectId, }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)


    return <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">

            <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-screen">
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
                Preview: Todo
            </ResizablePanel>

        </ResizablePanelGroup>
    </div>
}