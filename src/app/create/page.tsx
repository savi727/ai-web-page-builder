"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const page = () => {
    const router = useRouter()
    const [value, setValue] = useState("")
    const trpc = useTRPC()
    const createProjects = useMutation(trpc.projects.create.mutationOptions({
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            router.push(`/projects/${data.id}`)
        }
    }))
    return <div className="h-screen w-screen flex items-center justify-center">
        <div className="max-w-sm w-full flex flex-col gap-4 px-4 py-2 ">
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
            <Button variant={"default"} disabled={createProjects.isPending} onClick={() => createProjects.mutate({ value: value })} >
                Submit
            </Button>
        </div>
    </div>
}

export default page