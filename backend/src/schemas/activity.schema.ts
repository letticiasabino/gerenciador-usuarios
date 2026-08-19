import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createActivitySchema = z.object({
  title: z
    .string({ required_error: "Título é obrigatório" })
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(150, "Título deve ter no máximo 150 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .nullable(),
  date: z
    .string({ required_error: "Data é obrigatória" })
    .regex(dateRegex, "Formato de data esperado: AAAA-MM-DD"),
  startTime: z
    .string({ required_error: "Horário inicial é obrigatório" })
    .regex(timeRegex, "Formato de horário esperado: HH:mm"),
  endTime: z
    .string()
    .regex(timeRegex, "Formato de horário esperado: HH:mm")
    .optional()
    .nullable(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).default("PENDING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export const updateActivitySchema = createActivitySchema.partial();

export const updateActivityStatusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"], {
    errorMap: () => ({ message: "Status inválido" }),
  }),
});

export const queryActivitiesSchema = z.object({
  date: z.string().regex(dateRegex).optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
});
