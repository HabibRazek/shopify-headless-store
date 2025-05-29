import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white text-green-700 border border-green-200 shadow-sm hover:bg-green-50 hover:border-green-300 hover:shadow-md transform hover:scale-105 active:scale-95",
        destructive:
          "bg-white text-red-600 border border-red-200 shadow-sm hover:bg-red-50 hover:border-red-300 hover:shadow-md transform hover:scale-105 active:scale-95",
        outline:
          "bg-white text-green-700 border border-green-200 shadow-sm hover:bg-green-50 hover:border-green-300 hover:shadow-md transform hover:scale-105 active:scale-95",
        secondary:
          "bg-green-50 text-green-700 border border-green-200 shadow-sm hover:bg-green-100 hover:border-green-300 hover:shadow-md transform hover:scale-105 active:scale-95",
        ghost: "text-green-700 hover:bg-green-50 hover:text-green-800 rounded-lg",
        link: "text-green-600 underline-offset-4 hover:underline hover:text-green-700",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-lg",
        sm: "h-8 px-4 text-xs rounded-md",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
