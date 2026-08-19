import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Activity, CreateActivityInput, UpdateActivityInput } from "@/types";

const activityFormSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(150, "Título deve ter no máximo 150 caracteres"),
  description: z.string().max(500, "Descrição muito longa").optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (AAAA-MM-DD)"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário inválido (HH:mm)"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário inválido (HH:mm)")
    .optional()
    .or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

interface ActivityFormModalProps {
  activity?: Activity | null;
  defaultDate?: string;
  onClose: () => void;
  onSubmit: (data: CreateActivityInput | UpdateActivityInput) => Promise<void>;
}

export function ActivityFormModal({
  activity,
  defaultDate,
  onClose,
  onSubmit,
}: ActivityFormModalProps) {
  const isEditing = Boolean(activity);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: activity?.title ?? "",
      description: activity?.description ?? "",
      date: activity?.date ?? defaultDate ?? new Date().toISOString().split("T")[0],
      startTime: activity?.startTime ?? "09:00",
      endTime: activity?.endTime ?? "",
      priority: activity?.priority ?? "MEDIUM",
      status: activity?.status ?? "PENDING",
    },
  });

  const handleFormSubmit = async (values: ActivityFormData) => {
    try {
      const payload: CreateActivityInput | UpdateActivityInput = {
        title: values.title,
        description: values.description || null,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime || null,
        priority: values.priority,
        status: values.status,
      };

      await onSubmit(payload);
      toast.success(
        isEditing
          ? "Atividade atualizada com sucesso"
          : "Atividade cadastrada com sucesso",
      );
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar atividade",
      );
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isEditing ? "Editar Atividade" : "Nova Atividade"}
      description={
        isEditing
          ? "Atualize as informações do compromisso ou evento."
          : "Preencha os detalhes para agendar uma nova atividade."
      }
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="activity-form" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-1.5" />
            {isSubmitting
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Cadastrar atividade"}
          </Button>
        </>
      }
    >
      <form
        id="activity-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
        noValidate
      >
        <div>
          <label
            htmlFor="activity-title"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Título da Atividade *
          </label>
          <Input
            id="activity-title"
            placeholder="Ex.: Reunião de Alinhamento"
            {...register("title")}
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="activity-description"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Descrição (opcional)
          </label>
          <Input
            id="activity-description"
            placeholder="Ex.: Pautas a serem discutidas com a equipe"
            {...register("description")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="activity-date"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Data *
            </label>
            <Input
              id="activity-date"
              type="date"
              {...register("date")}
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="activity-startTime"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Início *
            </label>
            <Input
              id="activity-startTime"
              type="time"
              {...register("startTime")}
              aria-invalid={Boolean(errors.startTime)}
            />
            {errors.startTime && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="activity-endTime"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Término
            </label>
            <Input
              id="activity-endTime"
              type="time"
              {...register("endTime")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="activity-priority"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Prioridade *
            </label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="activity-priority">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label
              htmlFor="activity-status"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Status *
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="activity-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="COMPLETED">Concluído</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
