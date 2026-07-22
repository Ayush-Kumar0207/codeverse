"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import type { FullscreenPanel } from "./types";

export function useWorkspaceLayout(projectReady: boolean, initialRightTab: string) {
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const bottomPanelRef = useRef<ImperativePanelHandle>(null);
  const responsivePanelsCollapsedRef = useRef(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [rightTab, setRightTab] = useState(initialRightTab);
  const [fullscreenPanel, setFullscreenPanel] = useState<FullscreenPanel>(null);
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    let animationFrame = 0;
    const syncLayout = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const compact = media.matches;
        setIsCompactLayout(compact);
        if (compact && projectReady && !responsivePanelsCollapsedRef.current) {
          leftPanelRef.current?.collapse();
          rightPanelRef.current?.collapse();
          setLeftCollapsed(true);
          setRightCollapsed(true);
          responsivePanelsCollapsedRef.current = true;
        } else if (!compact && responsivePanelsCollapsedRef.current) {
          leftPanelRef.current?.expand();
          rightPanelRef.current?.expand();
          setLeftCollapsed(false);
          setRightCollapsed(false);
          setFullscreenPanel(null);
          responsivePanelsCollapsedRef.current = false;
        }
      });
    };
    syncLayout();
    media.addEventListener("change", syncLayout);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      media.removeEventListener("change", syncLayout);
    };
  }, [projectReady]);

  useEffect(() => {
    if (!projectReady || !isCompactLayout) return;
    const timeout = window.setTimeout(() => {
      leftPanelRef.current?.collapse();
      rightPanelRef.current?.collapse();
      setLeftCollapsed(true);
      setRightCollapsed(true);
      responsivePanelsCollapsedRef.current = true;
    }, 80);
    return () => window.clearTimeout(timeout);
  }, [isCompactLayout, projectReady]);

  useEffect(() => {
    if (!fullscreenPanel) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (window.matchMedia("(max-width: 1023px)").matches) {
        if (fullscreenPanel === "explorer") {
          leftPanelRef.current?.collapse();
          setLeftCollapsed(true);
        }
        if (fullscreenPanel === "assistant") {
          rightPanelRef.current?.collapse();
          setRightCollapsed(true);
        }
      }
      setFullscreenPanel(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullscreenPanel]);

  useEffect(() => {
    const openAssistantPanel = () => {
      rightPanelRef.current?.expand();
      setRightCollapsed(false);
      setRightTab("assistant");
    };
    window.addEventListener("codeverse:open-assistant-panel", openAssistantPanel);
    return () => window.removeEventListener("codeverse:open-assistant-panel", openAssistantPanel);
  }, []);

  const toggleBottomPanel = useCallback(() => {
    if (bottomCollapsed) {
      bottomPanelRef.current?.expand();
      setBottomCollapsed(false);
    } else {
      bottomPanelRef.current?.collapse();
      setBottomCollapsed(true);
    }
  }, [bottomCollapsed]);

  const openBottomPanel = useCallback(() => {
    bottomPanelRef.current?.expand();
    setBottomCollapsed(false);
  }, []);

  return {
    leftPanelRef,
    rightPanelRef,
    bottomPanelRef,
    leftCollapsed,
    setLeftCollapsed,
    rightCollapsed,
    setRightCollapsed,
    bottomCollapsed,
    setBottomCollapsed,
    rightTab,
    setRightTab,
    fullscreenPanel,
    setFullscreenPanel,
    isCompactLayout,
    isEditorFullscreen: fullscreenPanel === "editor",
    isExplorerFullscreen: fullscreenPanel === "explorer",
    isAssistantFullscreen: fullscreenPanel === "assistant",
    isOutputFullscreen: fullscreenPanel === "output",
    toggleBottomPanel,
    openBottomPanel,
  };
}
