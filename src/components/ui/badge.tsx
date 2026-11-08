import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#5D4037] text-[#FAF7F2] shadow-sm hover:bg-[#4E342E]",
        secondary: "border-transparent bg-[#F5EDE4] text-[#4E342E] hover:bg-[#E8D8C8]",
        destructive: "border-transparent bg-rose-50 text-rose-800 border border-rose-200",
        outline: "border-[#D4BCA7] text-[#4E342E] bg-white shadow-xs",

        // KOS: Coklat dominan dengan aksen Krem
        kos: "bg-[#5D4037] text-[#FAF7F2] border border-[#4E342E] font-bold shadow-xs",

        // KONTRAKAN: Krem dominan dengan aksen Coklat
        kontrakan: "bg-[#F5EDE4] text-[#4E342E] border border-[#D4BCA7] font-bold shadow-xs",

        success: "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold",
        warning: "bg-amber-50 text-amber-900 border border-amber-200 font-semibold",
        featured: "bg-gradient-to-r from-[#8D6E63] to-[#5D4037] text-[#FAF7F2] shadow-sm font-bold border border-[#4E342E]",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs rounded-full",
        sm: "px-2 py-0.5 text-[11px] rounded-full",
        lg: "px-3.5 py-1 text-sm rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
