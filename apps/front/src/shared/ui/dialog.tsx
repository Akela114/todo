import { Cross2Icon } from "@radix-ui/react-icons";
import type { ReactNode } from "@tanstack/react-router";
import { type ComponentRef, type RefObject, useRef } from "react";

interface ModalProps {
  title: string;
  renderModalButton: (onClick: () => void) => ReactNode;
  children: ReactNode;
  ref?: RefObject<ComponentRef<"dialog"> | null>;
}

export const Modal = ({
  title,
  renderModalButton,
  children,
  ref,
}: ModalProps) => {
  const dialogRef = useRef<ComponentRef<"dialog">>(null);

  return (
    <>
      {renderModalButton(() => dialogRef.current?.showModal())}
      <dialog
        ref={(el) => {
          dialogRef.current = el;
          if (ref) {
            ref.current = el;
          }
        }}
        className="modal"
      >
        <div className="modal-box">
          <div className="flex items-center justify-between gap-2">
            <div className="font-bold text-lg">{title}</div>
            <form method="dialog">
              <button
                type="submit"
                className="btn btn-sm btn-circle btn-ghost -mr-2"
              >
                <Cross2Icon />
              </button>
            </form>
          </div>
          <div className="py-4">{children}</div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit" />
        </form>
      </dialog>
    </>
  );
};
