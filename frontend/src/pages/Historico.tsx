import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  FileClock,
  KeyRound,
  LogIn,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  UserRoundCog,
  Users as UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { logService } from "@/services/api";
import type { AuditLog } from "@/types";
import { formatDateTime, formatRelativeTime } from "@/utils";

type FilterType =
  | "ALL"
  | "User"
  | "Activity"
  | "Admin"
  | "LOGIN"
  | "USER_DELETED";

const FILTERS: { value: FilterType; label: string; entity?: string; action?: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "User", label: "Usuários", entity: "User" },
  { value: "Activity", label: "Atividades", entity: "Activity" },
  { value: "Admin", label: "Perfil & Segurança", entity: "Admin" },
  { value: "LOGIN", label: "Acessos / Logins", action: "LOGIN" },
  { value: "USER_DELETED", label: "Exclusões", action: "USER_DELETED" },
];

function getActionMeta(action: string) {
  switch (action) {
    case "USER_CREATED":
      return {
        label: "Criação de Usuário",
        icon: UserPlus,
        colorClass: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
      };
    case "USER_UPDATED":
      return {
        label: "Edição de Usuário",
        icon: UserRoundCog,
        colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
      };
    case "USER_STATUS_CHANGED":
      return {
        label: "Alteração de Status",
        icon: UserCheck,
        colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      };
    case "USER_DELETED":
      return {
        label: "Exclusão de Usuário",
        icon: Trash2,
        colorClass: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
      };
    case "ACTIVITY_CREATED":
      return {
        label: "Nova Atividade",
        icon: CalendarDays,
        colorClass: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
      };
    case "ACTIVITY_UPDATED":
    case "ACTIVITY_STATUS_CHANGED":
      return {
        label: "Atividade Atualizada",
        icon: CalendarDays,
        colorClass: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
      };
    case "ACTIVITY_DELETED":
      return {
        label: "Atividade Excluída",
        icon: Trash2,
        colorClass: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
      };
    case "LOGIN":
      return {
        label: "Autenticação",
        icon: LogIn,
        colorClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
      };
    case "PASSWORD_CHANGED":
      return {
        label: "Alteração de Senha",
        icon: KeyRound,
        colorClass: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
      };
    case "PROFILE_UPDATED":
      return {
        label: "Perfil Atualizado",
        icon: ShieldCheck,
        colorClass: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
      };
    default:
      return {
        label: "Sistema",
        icon: ShieldCheck,
        colorClass: "bg-slate-100 text-slate-600 dark:bg-dark-800 dark:text-slate-400",
      };
  }
}

export function Historico() {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const selectedFilter = FILTERS.find((f) => f.value === filter);
      const res = await logService.findAll({
        entity: selectedFilter?.entity,
        action: selectedFilter?.action,
        limit: 50,
      });
      setLogs(res.data);
      setTotalItems(res.pagination.totalItems);
    } catch {
      toast.error("Erro ao carregar registros de auditoria");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Histórico de Auditoria
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Registro real de ações e eventos realizados no sistema.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fetchLogs()}
          disabled={loading}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={cn("h-4 w-4 mr-1.5", loading && "animate-spin")} />
          Atualizar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant={filter === item.value ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <Card className="divide-y divide-slate-100 p-2 dark:divide-dark-800">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <FileClock className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Nenhum registro de auditoria encontrado
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filter !== "ALL"
                ? "Tente selecionar outro filtro ou limpar a seleção."
                : "Realize ações no sistema para visualizar o histórico de eventos."}
            </p>
            {filter !== "ALL" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFilter("ALL")}
              >
                Ver todos os registros
              </Button>
            )}
          </div>
        ) : (
          logs.map((log) => {
            const meta = getActionMeta(log.action);
            const Icon = meta.icon;

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-dark-800/60"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    meta.colorClass,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    <span className="font-semibold text-brand-700 dark:text-brand-400">
                      {log.actor}
                    </span>{" "}
                    {log.description}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatDateTime(log.createdAt)} ({formatRelativeTime(log.createdAt)})
                  </p>
                </div>

                <span className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-dark-800 dark:text-slate-400 sm:inline">
                  {meta.label}
                </span>
              </div>
            );
          })
        )}
      </Card>

      <p className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <UsersIcon className="h-3.5 w-3.5" />
        Exibindo {logs.length} de {totalItems} registros registrados no banco de dados
      </p>
    </div>
  );
}
