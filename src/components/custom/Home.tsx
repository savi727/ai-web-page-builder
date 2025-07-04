"use client"
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function HomeComponent() {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.hello.queryOptions({ value: "Savi - Fetching in Client Component" }))
    const invoke = useMutation(trpc.invoke.mutationOptions({
        onSuccess: () => {
            toast.success("Background job started")
        }
    }))
    return (
        <div>
            Client Side Data Fetching : -
            {JSON.stringify(data)}
            <br />

            <Button className="my-4 cursor-pointer" disabled={invoke.isPending} variant={"secondary"} onClick={() => invoke.mutate({ value: "savi" })}>
                Invoke Background Jobs
            </Button>
        </div>
    )
}