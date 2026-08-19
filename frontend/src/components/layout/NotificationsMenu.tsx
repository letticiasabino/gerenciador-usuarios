import { useEffect, useMemo, useState } from "react";
import { Bell, Calendar, Check, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { activityService } from "@/services/api";
import type { Activity, AppNotification } from "@/types";

const READ_NOTIFICATIONS_KEY = "gerenciador-usuarios:read_notifications";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // ignore
  }
  return new Set();
}

function saveReadIds(set: Set<string>) {
  localStorage.setItem(
    READ_NOTIFICATIONS_KEY,
    JSON.stringify(Array.from(set)),
  );
}

export function NotificationsMenu() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds);

  useEffect(() => {
    activityService
      .findAll()
      .then((data) => setActivities(data))
      .catch(() => {});
  }, []);

  const notifications: AppNotification[] = useMemo(() => {
    const list: AppNotification[] = [];
    const todayStr = new Date().toISOString().split("T")[0];

    const todayActivities = activities.filter((a) => a.date === todayStr);
    if (todayActivities.length > 0) {
      list.push({
        id: `today-${todayStr}`,
        title: `Você tem ${todayActivities.length} atividade(s) hoje`,
        message: todayActivities.map((a) => `${a.startTime} - ${a.title}`).join(", "),
        date: todayStr,
        read: readIds.has(`today-${todayStr}`),
        type: "warning",
        link: "/calendario",
      });
    }

    const highPriority = activities.filter(
      (a) => a.priority === "HIGH" && a.status === "PENDING",
    );
    for (const act of highPriority.slice(0, 3)) {
      const id = `high-${act.id}`;
      list.push({
        id,
        title: `Alta prioridade: ${act.title}`,
        message: `Agendada para ${act.date} às ${act.startTime}`,
        date: act.date,
        read: readIds.has(id),
        type: "warning",
        link: "/calendario",
      });
    }

    if (list.length === 0) {
      list.push({
        id: "welcome-system",
        title: "Tudo em dia!",
        message: "Nenhuma pendência crítica encontrada no sistema.",
        date: todayStr,
        read: readIds.has("welcome-system"),
        type: "success",
      });
    }

    return list;
  }, [activities, readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notificações"
          className="relative text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-dark-800 dark:hover:text-slate-200"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Notificações
            </span>
            {unreadCount > 0 && (
              <Badge variant="blue" className="px-1.5 py-0 text-xs">
                {unreadCount} nova(s)
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Marcar lidas
            </Button>
          )}
        </div>

        <div className="max-h-80 divide-y overflow-y-auto">
          {notifications.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => {
                markAsRead(item.id);
                if (item.link) navigate(item.link);
              }}
              className={cn(
                "flex cursor-pointer items-start gap-3 p-3.5 transition-colors focus:bg-slate-50 dark:focus:bg-dark-800",
                !item.read && "bg-brand-50/40 dark:bg-brand-500/10",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  item.type === "warning"
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                    : "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
                )}
              >
                {item.link ? (
                  <Calendar className="h-3.5 w-3.5" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  {!item.read && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {item.message}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        <div className="flex items-center justify-between p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/calendario")}
            className="w-full text-xs font-medium text-brand-600 dark:text-brand-400"
          >
            Ver todas no Calendário
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
