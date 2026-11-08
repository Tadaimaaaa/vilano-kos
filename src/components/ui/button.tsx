import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#5D4037] text-[#FAF7F2] shadow-sm hover:bg-[#4E342E] hover:shadow-md",
        gradient:
          "bg-gradient-to-r from-[#795548] via-[#6D4C41] to-[#4E342E] text-[#FAF7F2] shadow-md hover:from-[#6D4C41] hover:to-[#3E2723] hover:shadow-lg",

        // KOS: Coklat dominan dengan teks Krem
        kos:
          "bg-[#5D4037] text-[#FAF7F2] shadow-sm hover:bg-[#4E342E] border border-[#3E2723]",

        // KONTRAKAN: Krem dominan dengan teks Coklat
        kontrakan:
          "bg-[#F5EDE4] text-[#4E342E] border-2 border-[#D4BCA7] shadow-sm hover:bg-[#E8D8C8]",

        destructive:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
        outline:
          "border border-[#D4BCA7] bg-white text-[#4E342E] shadow-xs hover:bg-[#F5EDE4] hover:text-[#3E2723] hover:border-[#A98467]",
        secondary:
          "bg-[#F5EDE4] text-[#4E342E] hover:bg-[#E8D8C8] shadow-xs",
        ghost:
          "text-[#5D4037] hover:bg-[#F5EDE4] hover:text-[#3E2723]",
        link:
          "text-[#5D4037] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-12 px-6 text-base rounded-2xl",
        xl: "h-14 px-8 text-base rounded-2xl font-bold shadow-md",
        icon: "h-10 w-10 rounded-xl",
        iconSm: "h-8 w-8 rounded-lg",
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
