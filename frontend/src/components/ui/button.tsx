import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@frontend/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors  focus:visible focus:bg-primary focus:bg-dark-50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          " bg-primary dark:bg-primary text-white hover:bg-primary/90 dark:hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input dark:border-none  outline-none focus:outline-none bg-background hover:bg-gray-50 dark:bg-dark-800 dark:hover:bg-dark-600 hover:text-accent-foreground",
        secondary:
          "bg-secondary dark:bg-dark-700 text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-slate-50 dark:hover:bg-dark-700  hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
