import prisma from "../config/database";

export interface CreateLogDTO {
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  actor?: string;
  adminId?: string;
}

export class LogService {
  static async create(data: CreateLogDTO) {
    try {
      return await prisma.auditLog.create({
        data: {
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          description: data.description,
          actor: data.actor || "Admin",
          adminId: data.adminId,
        },
      });
    } catch {
      // Falha ao registrar log não deve interromper a operação principal
      return null;
    }
  }

  static async findAll(params?: {
    action?: string;
    entity?: string;
    limit?: number;
    page?: number;
  }) {
    const limit = Math.min(Math.max(Number(params?.limit) || 20, 1), 100);
    const page = Math.max(Number(params?.page) || 1, 1);
    const skip = (page - 1) * limit;

    const where: {
      action?: string;
      entity?: string;
    } = {};

    if (params?.action && params.action !== "ALL") {
      where.action = params.action;
    }

    if (params?.entity && params.entity !== "ALL") {
      where.entity = params.entity;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }
}
