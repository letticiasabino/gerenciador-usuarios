import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconClassName,
  trend,
  loading = false,
}: StatsCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          iconClassName ?? "bg-brand-50 text-brand-600",
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        {loading ? (
          <Skeleton className="mt-1 h-7 w-16" />
        ) : (
          <p className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {value.toLocaleString("pt-BR")}
            </span>
            {trend && (
              <span className="text-xs font-semibold text-green-600">
                {trend}
              </span>
            )}
          </p>
        )}
      </div>
    </Card>
  );
}
