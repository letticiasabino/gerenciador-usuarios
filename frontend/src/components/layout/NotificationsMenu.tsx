import { useEffect, useState, useCallback } from "react";
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
import { notificationService } from "@/services/api";
import type { AppNotification } from "@/types";

export function NotificationsMenu() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationService.findAll();
      setNotifications(res.data);
      setUnreadCount(res.unreadCount);
    } catch {
      // Falha silenciosa
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string, link?: string | null) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (link) navigate(link);
    } catch {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
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
        <div className="flex items-center justify-between border-b px-4 py-3 dark:border-dark-800">
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
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Marcar lidas
            </Button>
          )}
        </div>

        <div className="max-h-80 divide-y overflow-y-auto dark:divide-dark-800">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Tudo em dia! Nenhuma pendência encontrada.
            </div>
          ) : (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleMarkAsRead(item.id, item.link)}
                className={cn(
                  "flex cursor-pointer items-start gap-3 p-3.5 transition-colors focus:bg-slate-50 dark:focus:bg-dark-800",
                  !item.isRead && "bg-brand-50/40 dark:bg-brand-500/10",
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
                    {!item.isRead && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {item.message}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
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
