import Image from "next/image"
import { useEffect, useState } from "react"

const ShimmerMessages = () => {
    const messages = [
        "Thinking...",
        "Loading...",
        "Generating...",
        "Analyzing your request...",
        "Building your website...",
        "Crafting components...",
        "Optimizing layouts...",
        "Adding final touches...",
        "Almost ready..."
    ]

    const [currentmessageIndex, setCurrentMessageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        }, 2000)

        return () => {
            clearInterval(interval)
        }

    }, [messages.length])
}
export const MessageLoading = () => {
    return <div>
        <span className="text-base text-muted-foreground animate-pulse">

        </span>
    </div>
}