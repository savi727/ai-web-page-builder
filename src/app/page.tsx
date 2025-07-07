import HomeComponent from "@/components/custom/Home";
import PrefetchComponent from "@/components/custom/PrefetchComponent";
import { caller, getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Home() {


  return (
    <HydrationBoundary >
      <Suspense fallback={<p>Loading...</p>}>
        <PrefetchComponent />
      </Suspense>
      <div>
        <HomeComponent />
      </div>
    </HydrationBoundary>
  )
}

