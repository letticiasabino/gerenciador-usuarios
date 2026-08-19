import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ListFilter,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { ActivityFormModal } from "@/components/calendar/ActivityFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { activityService } from "@/services/api";
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from "@/types";
import { formatDate } from "@/utils";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function buildCalendar(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

function formatDateString(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

type TabType = "day" | "month";

export function Calendario() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    formatDateString(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  const [activeTab, setActiveTab] = useState<TabType>("day");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);

  const monthParam = `${view.year}-${String(view.month + 1).padStart(2, "0")}`;

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await activityService.findAll({ month: monthParam });
      setActivities(data);
    } catch {
      toast.error("Erro ao carregar atividades do mês");
    } finally {
      setLoading(false);
    }
  }, [monthParam]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const cells = useMemo(
    () => buildCalendar(view.year, view.month),
    [view.year, view.month],
  );

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const act of activities) {
      const list = map.get(act.date) ?? [];
      list.push(act);
      map.set(act.date, list);
    }
    return map;
  }, [activities]);

  const dayActivities = useMemo(() => {
    return activities.filter((act) => act.date === selectedDate);
  }, [activities, selectedDate]);

  const groupedMonthActivities = useMemo(() => {
    const map = new Map<string, Activity[]>();
    for (const act of activities) {
      const list = map.get(act.date) ?? [];
      list.push(act);
      map.set(act.date, list);
    }
    return Array.from(map.entries()).sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB),
    );
  }, [activities]);

  const changeMonth = (delta: number) => {
    setView((prev) => {
      let month = prev.month + delta;
      let year = prev.year;
      if (month < 0) {
        month = 11;
        year -= 1;
      } else if (month > 11) {
        month = 0;
        year += 1;
      }
      return { year, month };
    });
  };

  const handleSelectDay = (day: number) => {
    const dateStr = formatDateString(view.year, view.month, day);
    setSelectedDate(dateStr);
    setActiveTab("day");
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    view.month === today.getMonth() &&
    view.year === today.getFullYear();

  const isSelected = (day: number) => {
    const dateStr = formatDateString(view.year, view.month, day);
    return dateStr === selectedDate;
  };

  const handleCreateActivity = async (
    data: CreateActivityInput | UpdateActivityInput,
  ) => {
    await activityService.create(data as CreateActivityInput);
    await fetchActivities();
  };

  const handleUpdateActivity = async (
    data: CreateActivityInput | UpdateActivityInput,
  ) => {
    if (!editingActivity) return;
    await activityService.update(editingActivity.id, data as UpdateActivityInput);
    await fetchActivities();
  };

  const handleToggleStatus = async (activity: Activity) => {
    try {
      const newStatus =
        activity.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      await activityService.updateStatus(activity.id, newStatus);
      toast.success(
        newStatus === "COMPLETED"
          ? "Atividade marcada como concluída"
          : "Atividade reaberta",
      );
      await fetchActivities();
    } catch {
      toast.error("Erro ao alterar status da atividade");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingActivity) return;
    try {
      await activityService.delete(deletingActivity.id);
      toast.success("Atividade excluída com sucesso");
      setDeletingActivity(null);
      await fetchActivities();
    } catch {
      toast.error("Erro ao excluir atividade");
    }
  };

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Calendário de Atividades
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie compromissos, reuniões e eventos integrados ao sistema.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Nova Atividade
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {MONTHS[view.month]} {view.year}
              </CardTitle>
              <CardDescription>
                Clique em qualquer dia para visualizar ou selecione a visão do mês.
              </CardDescription>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setView({
                    year: today.getFullYear(),
                    month: today.getMonth(),
                  });
                  setSelectedDate(
                    formatDateString(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate(),
                    ),
                  );
                }}
              >
                Hoje
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Mês anterior"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Próximo mês"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {WEEKDAYS.map((weekday) => (
                <span
                  key={weekday}
                  className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
                >
                  {weekday}
                </span>
              ))}
              {cells.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="h-16 rounded-xl border border-transparent p-1 sm:h-20"
                    />
                  );
                }

                const dateKey = formatDateString(view.year, view.month, day);
                const dayEvents = activitiesByDate.get(dateKey) ?? [];
                const activeDay = isToday(day);
                const activeSelected = isSelected(day);

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={cn(
                      "flex h-16 flex-col items-center justify-between rounded-xl border p-1 text-left transition-all sm:h-20",
                      activeSelected
                        ? "border-brand-500 bg-brand-50/70 ring-2 ring-brand-500 dark:bg-brand-500/20"
                        : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50 dark:border-dark-800 dark:bg-dark-900 dark:hover:bg-dark-800",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-7 sm:w-7 sm:text-sm",
                        activeDay &&
                          "bg-brand-600 font-bold text-white shadow-sm",
                        !activeDay &&
                          activeSelected &&
                          "font-bold text-brand-700 dark:text-brand-300",
                        !activeDay &&
                          !activeSelected &&
                          "text-slate-700 dark:text-slate-300",
                      )}
                    >
                      {day}
                    </span>

                    {dayEvents.length > 0 && (
                      <div className="flex items-center gap-1 pb-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span
                            key={event.id}
                            className={cn(
                              "h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2",
                              event.status === "COMPLETED"
                                ? "bg-slate-400"
                                : event.priority === "HIGH"
                                  ? "bg-red-500"
                                  : event.priority === "MEDIUM"
                                    ? "bg-amber-500"
                                    : "bg-brand-500",
                            )}
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-500">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-dark-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("day")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                    activeTab === "day"
                      ? "bg-white text-brand-700 shadow-sm dark:bg-dark-700 dark:text-brand-300"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
                  )}
                >
                  Compromissos do Dia
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("month")}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                    activeTab === "month"
                      ? "bg-white text-brand-700 shadow-sm dark:bg-dark-700 dark:text-brand-300"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
                  )}
                >
                  Todos do Mês
                </button>
              </div>

              <Badge variant="outline" className="text-xs">
                {activeTab === "day"
                  ? `${dayActivities.length} dia`
                  : `${activities.length} mês`}
              </Badge>
            </div>

            <CardDescription className="pt-2 font-medium text-brand-600 dark:text-brand-400">
              {activeTab === "day"
                ? formattedSelectedDate
                : `${MONTHS[view.month]} de ${view.year} (Total: ${activities.length})`}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 p-4 max-h-[520px] overflow-y-auto">
            {loading ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : activeTab === "day" ? (
              dayActivities.length === 0 ? (
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-center py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-dark-800">
                    <CalendarDays className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Nenhuma atividade para esta data
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Clique abaixo para agendar um compromisso neste dia.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agendar atividade
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {dayActivities.map((act) => {
                    const isCompleted = act.status === "COMPLETED";

                    return (
                      <li
                        key={act.id}
                        className={cn(
                          "rounded-xl border p-3.5 transition-all",
                          isCompleted
                            ? "border-slate-200 bg-slate-50/70 opacity-75 dark:border-dark-800 dark:bg-dark-800/40"
                            : "border-slate-200 bg-white shadow-sm dark:border-dark-800 dark:bg-dark-900",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(act)}
                                title={
                                  isCompleted
                                    ? "Marcar como pendente"
                                    : "Marcar como concluída"
                                }
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                                  isCompleted
                                    ? "border-green-600 bg-green-600 text-white"
                                    : "border-slate-300 hover:border-green-500 dark:border-dark-700",
                                )}
                              >
                                {isCompleted && (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <p
                                className={cn(
                                  "truncate text-sm font-semibold",
                                  isCompleted
                                    ? "line-through text-slate-400 dark:text-slate-500"
                                    : "text-slate-900 dark:text-slate-100",
                                )}
                              >
                                {act.title}
                              </p>
                            </div>

                            {act.description && (
                              <p className="mt-1 pl-7 text-xs text-slate-500 dark:text-slate-400">
                                {act.description}
                              </p>
                            )}

                            <div className="mt-2.5 flex flex-wrap items-center gap-2 pl-7 text-xs text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {act.startTime}
                                {act.endTime ? ` - ${act.endTime}` : ""}
                              </span>

                              <Badge
                                variant={
                                  act.priority === "HIGH"
                                    ? "red"
                                    : act.priority === "MEDIUM"
                                      ? "yellow"
                                      : "blue"
                                }
                                className="text-[10px] px-1.5 py-0"
                              >
                                {act.priority === "HIGH"
                                  ? "Alta"
                                  : act.priority === "MEDIUM"
                                    ? "Média"
                                    : "Baixa"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Editar"
                              onClick={() => setEditingActivity(act)}
                              className="h-7 w-7 text-slate-500 hover:text-brand-600"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Excluir"
                              onClick={() => setDeletingActivity(act)}
                              className="h-7 w-7 text-slate-500 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )
            ) : (
              /* Visão Consolidada de Todos do Mês */
              groupedMonthActivities.length === 0 ? (
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-center py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-dark-800">
                    <ListFilter className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Nenhuma atividade agendada neste mês
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {MONTHS[view.month]} de {view.year} ainda não possui compromissos.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Atividade
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedMonthActivities.map(([date, acts]) => (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center gap-2 border-b pb-1 dark:border-dark-800">
                        <span className="text-xs font-bold text-brand-700 dark:text-brand-400">
                          {formatDate(date)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({acts.length} {acts.length === 1 ? "item" : "itens"})
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {acts.map((act) => {
                          const isCompleted = act.status === "COMPLETED";

                          return (
                            <li
                              key={act.id}
                              className={cn(
                                "rounded-lg border p-2.5 transition-all text-xs",
                                isCompleted
                                  ? "border-slate-200 bg-slate-50/70 opacity-75 dark:border-dark-800 dark:bg-dark-800/40"
                                  : "border-slate-200 bg-white shadow-xs dark:border-dark-800 dark:bg-dark-900",
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleStatus(act)}
                                      className={cn(
                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                                        isCompleted
                                          ? "border-green-600 bg-green-600 text-white"
                                          : "border-slate-300 hover:border-green-500 dark:border-dark-700",
                                      )}
                                    >
                                      {isCompleted && (
                                        <CheckCircle2 className="h-3 w-3" />
                                      )}
                                    </button>
                                    <p
                                      className={cn(
                                        "font-semibold truncate",
                                        isCompleted
                                          ? "line-through text-slate-400 dark:text-slate-500"
                                          : "text-slate-900 dark:text-slate-100",
                                      )}
                                    >
                                      {act.title}
                                    </p>
                                  </div>

                                  <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-5 text-[11px] text-slate-500 dark:text-slate-400">
                                    <span className="inline-flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {act.startTime}
                                      {act.endTime ? ` - ${act.endTime}` : ""}
                                    </span>
                                    <Badge
                                      variant={
                                        act.priority === "HIGH"
                                          ? "red"
                                          : act.priority === "MEDIUM"
                                            ? "yellow"
                                            : "blue"
                                      }
                                      className="text-[9px] px-1 py-0"
                                    >
                                      {act.priority === "HIGH"
                                        ? "Alta"
                                        : act.priority === "MEDIUM"
                                          ? "Média"
                                          : "Baixa"}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="flex items-center gap-0.5">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Editar"
                                    onClick={() => setEditingActivity(act)}
                                    className="h-6 w-6 text-slate-500 hover:text-brand-600"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Excluir"
                                    onClick={() => setDeletingActivity(act)}
                                    className="h-6 w-6 text-slate-500 hover:text-red-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      {isCreateOpen && (
        <ActivityFormModal
          defaultDate={selectedDate}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreateActivity}
        />
      )}

      {editingActivity && (
        <ActivityFormModal
          activity={editingActivity}
          onClose={() => setEditingActivity(null)}
          onSubmit={handleUpdateActivity}
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingActivity)}
        onClose={() => setDeletingActivity(null)}
        title="Excluir Atividade"
        description={`Tem certeza que deseja excluir a atividade "${deletingActivity?.title}"?`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
