import { useState } from "react";
import {
  FileClock,
  LogIn,
  ShieldCheck,
  Trash2,
  UserPlus,
  UserRoundCog,
  Users as UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ActivityType = "login" | "create" | "edit" | "delete" | "system";

interface Activity {
  id: string;
  type: ActivityType;
  actor: string;
  message: string;
  time: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    type: "login",
    actor: "Admin",
    message: "Entrou na plataforma",
    time: "agora",
  },
  {
    id: "a2",
    type: "create",
    actor: "Lettícia Sabino",
    message: "Criou o usuário @mariana.lima",
    time: "há 5 min",
  },
  {
    id: "a3",
    type: "edit",
    actor: "Lettícia Sabino",
    message: "Atualizou o perfil de @carlos.edu",
    time: "há 32 min",
  },
  {
    id: "a4",
    type: "system",
    actor: "Sistema",
    message: "Backup automático concluído",
    time: "há 1 h",
  },
  {
    id: "a5",
    type: "login",
    actor: "João Pedro",
    message: "Tentativa de login falhou (2x)",
    time: "há 2 h",
  },
  {
    id: "a6",
    type: "delete",
    actor: "Admin",
    message: "Removeu o usuário @usuarioteste",
    time: "há 3 h",
  },
  {
    id: "a7",
    type: "edit",
    actor: "Ana Beatriz",
    message: "Alterou a senha da própria conta",
    time: "há 5 h",
  },
  {
    id: "a8",
    type: "create",
    actor: "Admin",
    message: "Criou o usuário @rafael.silva",
    time: "ontem",
  },
  {
    id: "a9",
    type: "system",
    actor: "Sistema",
    message: "Certificado SSL renovado",
    time: "ontem",
  },
  {
    id: "a10",
    type: "login",
    actor: "Admin",
    message: "Entrou na plataforma",
    time: "ontem",
  },
];

type Filter = "ALL" | ActivityType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "login", label: "Logins" },
  { value: "create", label: "Criações" },
  { value: "edit", label: "Edições" },
  { value: "delete", label: "Exclusões" },
  { value: "system", label: "Sistema" },
];

const TYPE_META: Record<
  ActivityType,
  { label: string; icon: typeof LogIn; iconClassName: string }
> = {
  login: {
    label: "Login",
    icon: LogIn,
    iconClassName: "bg-brand-50 text-brand-600",
  },
  create: {
    label: "Criação",
    icon: UserPlus,
    iconClassName: "bg-green-50 text-green-600",
  },
  edit: {
    label: "Edição",
    icon: UserRoundCog,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  delete: {
    label: "Exclusão",
    icon: Trash2,
    iconClassName: "bg-red-50 text-red-600",
  },
  system: {
    label: "Sistema",
    icon: ShieldCheck,
    iconClassName: "bg-purple-50 text-purple-600",
  },
};

export function Historico() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const filtered =
    filter === "ALL"
      ? ACTIVITIES
      : ACTIVITIES.filter((activity) => activity.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Histórico
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Registro de atividades recentes realizadas na plataforma.
        </p>
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
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <FileClock className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Nenhuma atividade encontrada
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tente selecionar outro filtro.
            </p>
          </div>
        ) : (
          filtered.map((activity) => {
            const meta = TYPE_META[activity.type];
            const Icon = meta.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-dark-800/60"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    meta.iconClassName,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    <span className="font-medium">{activity.actor}</span>{" "}
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {activity.time}
                  </p>
                </div>
                <span className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-dark-800 dark:text-slate-400 sm:inline">
                  {meta.label}
                </span>
              </div>
            );
          })
        )}
      </Card>

      <p className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <UsersIcon className="h-3.5 w-3.5" />
        Exibindo {filtered.length} de {ACTIVITIES.length} atividades recentes
      </p>
    </div>
  );
}
