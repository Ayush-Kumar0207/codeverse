"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextType = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within <Tabs />");
  }
  return context;
}

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
};

function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  
  const activeValue = value !== undefined ? value : internalValue;
  const setActiveValue = (val: string) => {
    if (onValueChange) onValueChange(val);
    if (value === undefined) setInternalValue(val);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, setValue: setActiveValue }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md border border-white/10 bg-black/30 p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, setValue } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all",
        isActive &&
          "bg-primary/20 text-primary shadow-[0_0_20px_rgba(99,102,241,0.25)]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <div className={cn("flex-1 outline-none", className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

