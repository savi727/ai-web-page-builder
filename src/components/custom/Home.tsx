"use client"
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function HomeComponent() {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.hello.queryOptions({ text: "Savi - Fetching in Client Component" }))
    return (
        <div>
            Client Side Data Fetching : -
            {JSON.stringify(data)}
        </div>
    )
}