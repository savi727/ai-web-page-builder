'use client'
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { MessageCard } from "./message-card"
import { MessageForm } from "./message-form"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { Fragment } from "@/generated/prisma"
import { JsonValue } from "@/generated/prisma/runtime/library"
import { MessageLoading } from "./message-loading"
interface Props {
    projectId: string;
    activeFragement: Fragment | null
    setActiveFragment: Dispatch<SetStateAction<{
        id: string;
        messageId: string;
        sandboxUrl: string;
        title: string;
        files: JsonValue;
        createdAt: Date;
        updatedAt: Date;
    } | null>>
}

export const MessagesContainer = ({ projectId, activeFragement, setActiveFragment }: Props) => {
    const bottomRef = useRef<HTMLDivElement>(null)

    const trpc = useTRPC()
    const { data: messages } = useSuspenseQuery(trpc.message.getMany.queryOptions({
        projectId: projectId
    }, { refetchInterval: 5000 }))

    useEffect(() => {
        const lastAssistantMessageFragment = messages.findLast((message) => message.role === "ASSISTANT" && !!message.fragment)
        if (lastAssistantMessageFragment && lastAssistantMessageFragment?.fragment) {
            setActiveFragment(lastAssistantMessageFragment.fragment)
        }
    }, [messages, setActiveFragment])

    useEffect(() => {
        bottomRef?.current?.scrollIntoView()
    }, [messages.length])

    const lastMessage = messages[messages.length - 1]
    const isLastMessageUser = lastMessage.role === "USER"



    return <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="pt-2 pr-1">
                {messages.map((message) => {
                    return <MessageCard
                        key={message.id}
                        content={message.content}
                        role={message.role}
                        fragment={message.fragment}
                        createdAt={message.createdAt}
                        isActiveFragment={activeFragement?.id === message?.fragment?.id}
                        onFragmentClick={() => setActiveFragment(message?.fragment)}
                        type={message.type}
                    />
                })}
                {isLastMessageUser && <MessageLoading />}
                <div ref={bottomRef} />
            </div>

        </div>
        <div className="relative p-2 pt-1">
            <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
            <MessageForm projectId={projectId} />
        </div>
    </div>

}