import { useRef, useEffect, useCallback } from "react";

export function useDynamicTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + "px";
    }
  }, []);

  // Resize textarea on input
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("input", resizeTextarea);
      return () => textarea.removeEventListener("input", resizeTextarea);
    }
  }, [resizeTextarea]);

  return {
    textareaRef,
    resizeTextarea,
  };
}
