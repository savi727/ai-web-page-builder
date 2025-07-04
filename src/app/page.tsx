import HomeComponent from "@/components/custom/Home";
import PrefetchComponent from "@/components/custom/PrefetchComponent";
import { caller, getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Home() {
  const data = await caller.hello({ text: "Savi - Fetching in Server Component " })
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.hello.queryOptions({ text: "Savi- Prefetching Data" }))

  await (async () => {
    return new Promise((res) => {
      setTimeout(() => {
        res("Resolved")
      }, 2000)
    })
  })()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <PrefetchComponent />
      </Suspense>
      <div>
        {JSON.stringify(data)}
        <HomeComponent />
      </div>
    </HydrationBoundary>
  )
}

