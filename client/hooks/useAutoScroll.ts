import { useRef, useEffect, useState, useCallback } from "react";

export function useAutoScroll(dependency: unknown[] = []) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAutoScroll) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, dependency);

  // Detect manual scrolling to disable auto-scroll
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold

    setIsAutoScroll(isAtBottom);
  }, []);

  // Add scroll listener
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return {
    messageEndRef,
    chatContainerRef,
    isAutoScroll,
    setIsAutoScroll,
  };
}
