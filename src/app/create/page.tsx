"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

const page = () => {
    const [value, setValue] = useState("")
    const trpc = useTRPC()
    const invoke = useMutation(trpc.invoke.mutationOptions({
        onSuccess: () => {
            toast.success("Background Job Started")
        }
    }))
    return <div className="flex justify-center ">
        <div className="max-w-sm w-full flex flex-col gap-4 px-4 py-2 ">
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
            <Button variant={"default"} disabled={invoke.isPending || !value} onClick={() => invoke.mutate({ value: value })} >
                Run Background Job
            </Button>
        </div>
    </div>
}

export default page