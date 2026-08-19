import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-100 text-slate-700 dark:bg-dark-800 dark:text-slate-300",
        green:
          "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
        red: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
        blue: "bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
        yellow:
          "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
        outline:
          "border border-slate-200 text-slate-600 dark:border-dark-700 dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
