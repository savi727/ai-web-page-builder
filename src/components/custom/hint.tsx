"use client";

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface HintProps {
    children: ReactNode;
    text: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
}

export const Hint = ({
    children,
    text,
    side = "top",
    align = "center",
}: HintProps) => {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                >
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
