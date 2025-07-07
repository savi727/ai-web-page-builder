"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

interface Props {
    projectId: string
}
export const ProjectView = ({ projectId }: Props) => {
    const trpc = useTRPC()
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId
    }))
    const { data: message } = useSuspenseQuery(trpc.message.getMany.queryOptions({
        projectId: projectId
    }))
    return <div>
        <div>
            {JSON.stringify(project, null, 2)}
        </div>
        <div>
            {JSON.stringify(message, null, 2)}
        </div>
    </div>
}