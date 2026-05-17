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
import { SearchIcon, CheckIcon } from "lucide-react"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b111c] text-slate-100 shadow-2xl",
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
          "top-[14%] w-full translate-y-0 overflow-hidden rounded-xl border border-white/10 bg-[#0b111c] p-0 shadow-2xl shadow-black/50 sm:max-w-[640px]",
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
    <div data-slot="command-input-wrapper" className="mt-4 flex items-center border-t border-white/10 bg-[#0f1725] px-4">
      <SearchIcon className="mr-3 size-4 shrink-0 text-slate-500" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-12 w-full rounded-md bg-transparent py-3 text-sm font-medium text-slate-100 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50",
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
        "no-scrollbar max-h-72 scroll-py-2 overflow-x-hidden overflow-y-auto outline-none",
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
      className={cn("py-6 text-center text-sm text-slate-400", className)}
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
        "overflow-hidden p-1 text-slate-100 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:text-[11px] **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-[0.14em] **:[[cmdk-group-heading]]:text-slate-500",
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
      className={cn("mx-2 my-2 h-px bg-white/10", className)}
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
        "group/command-item relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm outline-none select-none transition-colors",
        "data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-white",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "hover:bg-white/[0.04]",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <div className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-indigo-400 opacity-0 transition-opacity group-data-[selected=true]/command-item:opacity-100" />

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
        "ml-auto hidden rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[11px] font-medium text-slate-500 sm:inline-flex",
        "group-data-[selected=true]/command-item:border-white/20 group-data-[selected=true]/command-item:text-slate-300",
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
