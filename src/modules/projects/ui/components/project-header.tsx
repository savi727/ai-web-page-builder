"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    SunMediumIcon
} from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface Props {
    projectId: string
}

export const ProjectHeader = ({ projectId }: Props) => {
    const trpc = useTRPC()
    const { data: project } = useSuspenseQuery(
        trpc.projects.getOne.queryOptions({ id: projectId })
    )

    const { theme, setTheme } = useTheme()

    return (
        <header className="p-2 flex justify-between items-center border-b bg-white dark:bg-zinc-950">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                    >
                        <Image src="/logo.svg" alt="Savi" width={18} height={18} />
                        <span className="text-sm font-medium">{project.name}</span>
                        <ChevronDownIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    side="bottom"
                    align="start"
                    className="min-w-[200px] rounded-md border bg-white dark:bg-zinc-900 p-1 shadow-md z-50"
                >
                    <DropdownMenuItem asChild className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">
                        <Link href="/" className="flex items-center gap-2 w-full">
                            <ChevronLeftIcon className="size-4" />
                            <span>Go to Dashboard</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-zinc-700" />

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer">
                            <SunMediumIcon className="size-4 text-muted-foreground" />
                            <span>Appearance</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="min-w-[150px] rounded-md border bg-white dark:bg-zinc-900 p-1 shadow-md">
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    {["light", "dark", "system"].map((value) => (
                                        <DropdownMenuRadioItem
                                            key={value}
                                            value={value}
                                            className="px-8 py-1.5 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                                        >
                                            <span className="capitalize">{value}</span>
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
