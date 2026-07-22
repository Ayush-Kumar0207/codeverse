import ReactMarkdown from "react-markdown";

interface WorkspaceVisualPreviewProps {
  activeFile: string;
  language: string;
  activeContent: string;
  combinedPreview: string;
}

export function WorkspaceVisualPreview({
  activeFile,
  language,
  activeContent,
  combinedPreview,
}: WorkspaceVisualPreviewProps) {
  if (language === "markdown" || activeFile.endsWith(".md")) {
    return (
      <div className="custom-scrollbar h-full overflow-auto bg-[#05070b] p-6">
        <div className="prose prose-invert max-w-none prose-headings:tracking-normal prose-a:text-cyan-300 prose-code:rounded prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-100 prose-pre:border prose-pre:border-slate-800 prose-pre:bg-slate-950 prose-li:marker:text-slate-500">
          <ReactMarkdown>{activeContent.replace(/\\n/g, "\n")}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white">
      <div className="flex h-7 shrink-0 items-center gap-2 border-b bg-slate-100 px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="truncate font-mono text-[10px] text-slate-400">preview://simulation-environment/index.html</div>
      </div>
      <iframe
        srcDoc={combinedPreview}
        title="Workspace preview"
        className="w-full flex-1 border-none shadow-inner"
        sandbox="allow-scripts"
      />
    </div>
  );
}
