import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { Hint } from "./hint";
import { Button } from "../ui/button";
import { CodeView } from "../code-view";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbList, BreadcrumbSeparator, BreadcrumbEllipsis } from "../ui/breadcrumb";

type FileCollection = { [path: string]: string }

function getLanguageFromExtension(filename: string): string {
    const extn = filename.split(".").pop()?.toLocaleLowerCase();
    return extn || "text"
}

interface FileExplorerProps {
    files: FileCollection
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
    const [selectedFiles, setSelectedFiles] = useState<string | null>(() => {
        const filesKeys = Object.keys(files);
        return filesKeys?.length > 0 ? filesKeys[0] : null
    })

    return <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
            <p>TODO: Tree View</p>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={70} minSize={50}>
            {selectedFiles && files[selectedFiles] ?
                <div className="h-full w-full flex flex-col">
                    <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                        {/* TODO File Breadcrumbs */}
                        <Hint text="Copy to clipboard" side="bottom">
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                className="ml-auto"
                                onClick={() => { }}
                                disabled={false}
                            >
                                <CopyIcon />
                            </Button>

                        </Hint>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <CodeView
                            code={files[selectedFiles]}
                            lang={getLanguageFromExtension(selectedFiles)}

                        />

                    </div>
                </div> :
                <div className="flex h-full items-center text-muted-foreground">
                    Select a file to view it&apos;s content
                </div>
            }
        </ResizablePanel>
    </ResizablePanelGroup>

}