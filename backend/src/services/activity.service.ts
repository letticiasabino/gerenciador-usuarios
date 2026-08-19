import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { LogService } from "./log.service";

interface CreateActivityDto {
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime?: string | null;
  status?: string;
  priority?: string;
}

interface UpdateActivityDto {
  title?: string;
  description?: string | null;
  date?: string;
  startTime?: string;
  endTime?: string | null;
  status?: string;
  priority?: string;
}

interface QueryActivitiesDto {
  date?: string;
  month?: string;
  status?: string;
}

export class ActivityService {
  async create(data: CreateActivityDto) {
    const activity = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime ?? null,
        status: data.status ?? "PENDING",
        priority: data.priority ?? "MEDIUM",
      },
    });

    await LogService.create({
      action: "ACTIVITY_CREATED",
      entity: "Activity",
      entityId: activity.id,
      description: `Criou a atividade "${activity.title}" para ${activity.date}`,
    });

    return activity;
  }

  async findAll(query: QueryActivitiesDto) {
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.date) {
      where.date = query.date;
    } else if (query.month) {
      where.date = {
        startsWith: query.month,
      };
    }

    return prisma.activity.findMany({
      where,
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });
  }

  async findById(id: string) {
    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      throw new AppError("Atividade não encontrada", 404);
    }

    return activity;
  }

  async update(id: string, data: UpdateActivityDto) {
    await this.findById(id);

    const activity = await prisma.activity.update({
      where: { id },
      data,
    });

    await LogService.create({
      action: "ACTIVITY_UPDATED",
      entity: "Activity",
      entityId: activity.id,
      description: `Atualizou a atividade "${activity.title}"`,
    });

    return activity;
  }

  async updateStatus(id: string, status: string) {
    await this.findById(id);

    const activity = await prisma.activity.update({
      where: { id },
      data: { status },
    });

    await LogService.create({
      action: "ACTIVITY_STATUS_CHANGED",
      entity: "Activity",
      entityId: activity.id,
      description: `Alterou status da atividade "${activity.title}" para ${status === "COMPLETED" ? "Concluída" : "Pendente"}`,
    });

    return activity;
  }

  async delete(id: string) {
    const activity = await this.findById(id);

    await prisma.activity.delete({
      where: { id },
    });

    await LogService.create({
      action: "ACTIVITY_DELETED",
      entity: "Activity",
      entityId: id,
      description: `Removeu a atividade "${activity.title}"`,
    });
  }
}
