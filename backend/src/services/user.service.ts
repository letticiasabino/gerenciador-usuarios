import bcrypt from "bcrypt";
import prisma from "../config/database";
import {
  CreateUserInput,
  UpdateUserInput,
  QueryUsersInput,
} from "../schemas/user.schema";
import { config } from "../config/env";
import { AppError } from "../utils/AppError";
import { LogService } from "./log.service";

const USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  birthDate: true,
  street: true,
  number: true,
  complement: true,
  neighborhood: true,
  city: true,
  state: true,
  zipCode: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserService {
  async create(data: CreateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      config.bcryptSaltRounds,
    );

    const user = await prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        password: hashedPassword,
      },
      select: USER_SELECT,
    });

    await LogService.create({
      action: "USER_CREATED",
      entity: "User",
      entityId: user.id,
      description: `Criou o usuário ${user.fullName} (${user.email})`,
    });

    return user;
  }

  async findAll(query: QueryUsersInput) {
    const { page, limit, search, status, sortBy, order } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        select: USER_SELECT,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
      });
      if (emailExists) {
        throw new AppError("E-mail já cadastrado", 409);
      }
    }

    const updateData: Record<string, unknown> = { ...data };

    if (data.password && data.password !== "") {
      updateData.password = await bcrypt.hash(
        data.password,
        config.bcryptSaltRounds,
      );
    } else {
      delete updateData.password;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData as UpdateUserInput,
      select: USER_SELECT,
    });

    await LogService.create({
      action: "USER_UPDATED",
      entity: "User",
      entityId: user.id,
      description: `Atualizou o perfil de ${user.fullName}`,
    });

    return user;
  }

  async updateStatus(id: string, status: string) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: USER_SELECT,
    });

    await LogService.create({
      action: "USER_STATUS_CHANGED",
      entity: "User",
      entityId: user.id,
      description: `Alterou o status de ${user.fullName} para ${status === "ACTIVE" ? "Ativo" : "Inativo"}`,
    });

    return user;
  }

  async delete(id: string) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new AppError("Usuário não encontrado", 404);
    }

    await prisma.user.delete({ where: { id } });

    await LogService.create({
      action: "USER_DELETED",
      entity: "User",
      entityId: id,
      description: `Removeu o usuário ${existingUser.fullName} (${existingUser.email})`,
    });
  }

  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const currentMonth = now.getMonth() + 1;

    const [totalUsers, activeUsers, inactiveUsers, recentUsers, allUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { status: "INACTIVE" } }),
        prisma.user.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.user.findMany({
          select: { birthDate: true },
        }),
      ]);

    const birthdaysThisMonth = allUsers.filter((user) => {
      const birthDate = new Date(user.birthDate);
      return birthDate.getUTCMonth() + 1 === currentMonth;
    }).length;

    const recentUsersList = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      recentUsers,
      birthdaysThisMonth,
      recentUsersList,
    };
  }
}
