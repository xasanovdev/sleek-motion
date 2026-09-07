"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useState, type ReactNode } from "react";

export function ScrollRegion({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ScrollArea.Root className={`ui-scroll-area ${className}`}>
      <ScrollArea.Viewport className="ui-scroll-viewport">
        <ScrollArea.Content>{children}</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="ui-scrollbar">
        <ScrollArea.Thumb className="ui-scroll-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

export function NavigationSheet({
  trigger,
  label,
  title,
  closeLabel = "Close navigation",
  className,
  children,
}: {
  trigger: ReactNode;
  label: string;
  title: string;
  closeLabel?: string;
  className?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={className} aria-label={label}>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="ui-sheet-backdrop" />
        <Dialog.Popup className="ui-navigation-sheet">
          <div className="ui-sheet-header">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="ui-icon-button" aria-label={closeLabel}>
              <XMarkIcon className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <ScrollRegion>{children(() => setOpen(false))}</ScrollRegion>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
