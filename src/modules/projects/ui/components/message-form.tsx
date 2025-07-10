import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import TextareaAutoSize from "react-textarea-autosize"
import { z } from "zod"
import { toast } from "sonner"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import { FormField, Form } from "@/components/ui/form"
import { useState } from "react"
interface Props {
    projectId: string
}

const formSchema = z.object({
    value: z.string().min(1, { message: "Message is Required" }).max(10000, { message: "Value is too long" })
})

export const MessageForm = ({ projectId }: Props) => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const createMessage = useMutation(trpc.message.create.mutationOptions({
        onSuccess: (data) => {
            form.reset()
            queryClient.invalidateQueries(trpc.message.getMany.queryOptions({ projectId }))
            // TODO: Invalidate usage state
        },
        onError: (error) => {
            // TODO: Redirect to Pricing page if a specific error
            toast.error(error.message)
        }
    }))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: ""
        }
    })

    const onSumbit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            projectId: projectId,
            value: values.value
        })
    }
    const [isFocused, setIsFocused] = useState(false)
    const showUsage = false
    const isPending = createMessage.isPending
    const isButtonDisabled = isPending || !form.formState.isValid

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSumbit)}
            className={cn("relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                isFocused && "shadow-xs",
                showUsage && "rounded-t-none"
            )}
        >
            <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <TextareaAutoSize
                        {...field}
                        disabled={isPending}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        minRows={2}
                        maxRows={8}
                        className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                        placeholder="What would you like to build"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault()
                                form.handleSubmit(onSumbit)(e)
                            }
                        }}
                    />
                )}

            />
            <div className="flex gap-x-2 items-end justify-between pt-2 ">
                <div className="text-[10px] text-muted-foreground font-mono">
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span>&#8984;</span>Enter
                    </kbd>
                    &nbsp;to sumbit
                </div>
                <Button disabled={isButtonDisabled} className={cn("size-8 rounded-full", isButtonDisabled && "bg-muted-foreground border")}>
                    {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <ArrowUpIcon />}
                </Button>

            </div>
        </form>
    </Form>

}