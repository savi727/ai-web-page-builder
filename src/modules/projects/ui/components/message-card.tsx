"use client"
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";

interface Props {
    content: string;
    role: MessageRole
    fragment: Fragment | null
    createdAt: Date
    isActiveFragment: boolean
    onFragmentClick: (fragment: Fragment) => void
    type: MessageType
}

export const MessageCard = ({ content, role, fragment, createdAt, isActiveFragment, onFragmentClick, type }: Props) => {
    console.log("messages", content, role)
    if (role === "ASSISTANT") return <p>ASSISTANT</p>
    if (role === "USER") return <p>USER</p>
}