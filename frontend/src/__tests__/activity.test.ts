import { describe, it, expect } from "vitest";
import { z } from "zod";

const activitySchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().max(500).optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
});

describe("Activity Schema & Validation", () => {
  it("valida atividade com campos completos", () => {
    const valid = {
      title: "Reunião de Planejamento",
      description: "Discussão do roadmap do projeto",
      date: "2026-08-20",
      startTime: "14:00",
      endTime: "15:30",
      priority: "HIGH" as const,
      status: "PENDING" as const,
    };

    const result = activitySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejeita atividade com título curto", () => {
    const invalid = {
      title: "Oi",
      date: "2026-08-20",
      startTime: "14:00",
      priority: "MEDIUM" as const,
      status: "PENDING" as const,
    };

    const result = activitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejeita atividade com formato de data incorreto", () => {
    const invalid = {
      title: "Reunião Geral",
      date: "20/08/2026",
      startTime: "14:00",
      priority: "LOW" as const,
      status: "PENDING" as const,
    };

    const result = activitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejeita atividade com horário inválido", () => {
    const invalid = {
      title: "Reunião Geral",
      date: "2026-08-20",
      startTime: "25:70",
      priority: "LOW" as const,
      status: "PENDING" as const,
    };

    const result = activitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
