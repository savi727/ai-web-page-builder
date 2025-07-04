"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

const PrefetchComponent = () => {
    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.hello.queryOptions({ text: "Savi- Prefetching Data" }))
    return <div>
        {JSON.stringify(data)}
    </div>
}

export default PrefetchComponent