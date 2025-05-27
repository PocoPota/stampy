import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface CircleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const CircleButton = React.forwardRef<HTMLButtonElement, CircleButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant }),
          "rounded-full w-30 h-30 p-0",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
CircleButton.displayName = "CircleButton";

export { CircleButton };
