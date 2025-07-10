"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // ✅ GitHub Flavored Markdown
import "github-markdown-css";

interface Props {
  markdown: string;
}

export default function MarkdownPreview({ markdown }: Props) {
  return (
    <div className="w-1/2 h-full overflow-auto bg-white p-4 border-l markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
