"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

const page = () => {
    const [value, setValue] = useState("")
    const trpc = useTRPC()
    const { data: messages } = useQuery(trpc.message.getMany.queryOptions())
    const createMessage = useMutation(trpc.message.create.mutationOptions({
        onSuccess: () => {
            toast.success("Message Created")
        }
    }))
    return <div className="flex justify-center ">
        <div className="max-w-sm w-full flex flex-col gap-4 px-4 py-2 ">
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
            <Button variant={"default"} disabled={createMessage.isPending || !value} onClick={() => createMessage.mutate({ value: value })} >
                Run Background Job
            </Button>
            {JSON.stringify(messages, null, 2)}
        </div>
    </div>
}

export default page