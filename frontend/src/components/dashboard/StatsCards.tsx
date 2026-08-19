import { Cake, UserCheck, UserPlus, Users } from "lucide-react";
import type { UserStats } from "@/types";
import { StatsCard } from "./StatsCard";

interface StatsCardsProps {
  stats: UserStats | null;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total de Usuários"
        value={stats?.totalUsers ?? 0}
        icon={Users}
        iconClassName="bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
        loading={loading}
      />
      <StatsCard
        title="Usuários Ativos"
        value={stats?.activeUsers ?? 0}
        icon={UserCheck}
        iconClassName="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
        loading={loading}
      />
      <StatsCard
        title="Novos Usuários (30d)"
        value={stats?.recentUsers ?? 0}
        icon={UserPlus}
        iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
        loading={loading}
      />
      <StatsCard
        title="Aniversariantes no Mês"
        value={stats?.birthdaysThisMonth ?? 0}
        icon={Cake}
        iconClassName="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
        loading={loading}
      />
    </div>
  );
}
