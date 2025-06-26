import {
  PopoverContent,
  PopoverPortal,
  Popover as PopoverRoot,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { type ComponentProps, type ReactNode, useState } from "react";

interface PopoverProps {
  className?: string;
  children: ReactNode;
  renderTarget: (onClose: () => void) => ReactNode;
  side?: ComponentProps<typeof PopoverContent>["side"];
  align?: ComponentProps<typeof PopoverContent>["align"];
}

export const Popover = ({
  children,
  className,
  renderTarget,
  side = "bottom",
  align = "start",
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={className}>
          {children}
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent sideOffset={5} side={side} align={align}>
          {renderTarget(() => setIsOpen(false))}
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
};
