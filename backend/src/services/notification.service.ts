import prisma from "../config/database";
import { AppError } from "../utils/AppError";

export interface CreateNotificationDTO {
  title: string;
  message: string;
  type?: "info" | "warning" | "success";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  adminId: string;
  activityId?: string;
  link?: string;
}

export class NotificationService {
  static async create(data: CreateNotificationDTO) {
    if (data.activityId) {
      const existing = await prisma.notification.findFirst({
        where: {
          adminId: data.adminId,
          activityId: data.activityId,
          title: data.title,
        },
      });
      if (existing) {
        return existing;
      }
    }

    return prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type ?? "info",
        priority: data.priority ?? "MEDIUM",
        adminId: data.adminId,
        activityId: data.activityId,
        link: data.link,
      },
    });
  }

  static async syncActivityNotifications(adminId: string) {
    const todayStr = new Date().toISOString().split("T")[0];

    const [todayActivities, highPriorityActivities] = await Promise.all([
      prisma.activity.findMany({
        where: { date: todayStr },
      }),
      prisma.activity.findMany({
        where: {
          priority: "HIGH",
          status: "PENDING",
        },
      }),
    ]);

    if (todayActivities.length > 0) {
      const existingTodayNotification = await prisma.notification.findFirst({
        where: {
          adminId,
          title: `Atividades de hoje (${todayStr})`,
        },
      });

      if (!existingTodayNotification) {
        await prisma.notification.create({
          data: {
            title: `Atividades de hoje (${todayStr})`,
            message: `Você possui ${todayActivities.length} atividade(s) agendada(s) para hoje.`,
            type: "warning",
            priority: "MEDIUM",
            adminId,
            link: "/calendario",
          },
        });
      }
    }

    for (const act of highPriorityActivities) {
      const existingHigh = await prisma.notification.findFirst({
        where: {
          adminId,
          activityId: act.id,
          title: `Alta prioridade: ${act.title}`,
        },
      });

      if (!existingHigh) {
        await prisma.notification.create({
          data: {
            title: `Alta prioridade: ${act.title}`,
            message: `Agendada para ${act.date} às ${act.startTime}`,
            type: "warning",
            priority: "HIGH",
            adminId,
            activityId: act.id,
            link: "/calendario",
          },
        });
      }
    }
  }

  static async findAll(adminId: string) {
    await this.syncActivityNotifications(adminId);

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { adminId },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.notification.count({
        where: { adminId, isRead: false },
      }),
    ]);

    return {
      data: notifications,
      unreadCount,
    };
  }

  static async markAsRead(id: string, adminId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.adminId !== adminId) {
      throw new AppError("Notificação não encontrada", 404);
    }

    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  static async markAllAsRead(adminId: string) {
    await prisma.notification.updateMany({
      where: { adminId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  }

  static async delete(id: string, adminId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.adminId !== adminId) {
      throw new AppError("Notificação não encontrada", 404);
    }

    await prisma.notification.delete({
      where: { id },
    });
  }
}
