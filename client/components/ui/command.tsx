"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { SearchIcon, CheckIcon } from "lucide-react"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl border border-white/5 bg-background/80 backdrop-blur-xl text-foreground font-inter shadow-2xl",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/4 translate-y-0 overflow-hidden rounded-2xl border-white/10 bg-black/40 backdrop-blur-2xl p-0 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[data-slot=command-input-wrapper]]:border-b [&_[data-slot=command-input]]:h-12">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex items-center border-b border-white/5 px-4 bg-white/5">
      <SearchIcon className="mr-3 size-4 shrink-0 text-primary animate-pulse" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground font-medium",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none select-none transition-all duration-200",
        "data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary data-[selected=true]:translate-x-1",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "hover:bg-primary/5",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform group-data-[selected=true]/command-item:[&_svg]:scale-110",
        className
      )}
      {...props}
    >
      {/* Selection Glow */}
      <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary opacity-0 transition-opacity group-data-[selected=true]/command-item:opacity-100" />
      
      {children}
      <CheckIcon className="ml-auto opacity-0 group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-[10px] uppercase font-bold tracking-widest text-muted-foreground/30",
        "px-1.5 py-0.5 rounded border border-white/5 bg-white/5 shadow-inner",
        "group-data-[selected=true]/command-item:text-primary group-data-[selected=true]/command-item:border-primary/20",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
