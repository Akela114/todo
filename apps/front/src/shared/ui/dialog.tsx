import { Cross2Icon } from "@radix-ui/react-icons";
import type { ReactNode } from "@tanstack/react-router";
import { useState, useImperativeHandle, type RefObject } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";

interface ModalProps {
  title: string;
  triggerModalButton: ReactNode;
  children: ReactNode;
  ref?: RefObject<{ close: () => void } | null>;
}

export const Modal = ({
  title,
  triggerModalButton,
  children,
  ref,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      close: () => setIsOpen(false),
    }),
    [],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerModalButton}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/30" />
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 p-6 rounded-lg w-5/6 max-w-md shadow">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="font-bold text-lg">{title}</DialogTitle>
            <DialogClose asChild>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost -mr-2"
              >
                <Cross2Icon />
              </button>
            </DialogClose>
          </div>
          <div className="pt-4">{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
