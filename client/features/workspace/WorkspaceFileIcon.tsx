import { FileCode, FileText } from "lucide-react";

export function WorkspaceFileIcon({ fileName }: { fileName: string }) {
  if (fileName.endsWith(".md")) return <FileText className="h-4 w-4 text-blue-400" />;
  if (fileName.endsWith(".html")) return <FileCode className="h-4 w-4 text-orange-400" />;
  if (fileName.endsWith(".css")) return <FileCode className="h-4 w-4 text-blue-300" />;
  if (/\.(js|ts|jsx|tsx)$/.test(fileName)) return <FileCode className="h-4 w-4 text-yellow-400" />;
  if (fileName.endsWith(".py")) return <FileCode className="h-4 w-4 text-green-400" />;
  return <FileCode className="h-4 w-4 text-slate-500" />;
}
