import {
  PopoverContent,
  PopoverPortal,
  Popover as PopoverRoot,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { type ComponentProps, type ReactNode, useState } from "react";

interface PopoverProps {
  children: ReactNode;
  renderTarget: (onClose: () => void) => ReactNode;
  side?: ComponentProps<typeof PopoverContent>["side"];
  align?: ComponentProps<typeof PopoverContent>["align"];
  sideOffset?: number;
}

export const Popover = ({
  children,
  renderTarget,
  side = "bottom",
  align = "start",
  sideOffset = 5,
}: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          sideOffset={sideOffset}
          side={side}
          align={align}
          className="w-(--radix-popover-trigger-width) max-h-(--radix-popper-available-height) overflow-y-auto"
        >
          {renderTarget(() => setIsOpen(false))}
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
};
