import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/database";
import { config } from "../config/env";
import { AppError } from "../utils/AppError";
import { LogService } from "./log.service";

interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
}

export function sanitizeAdmin(admin: Admin) {
  const { password: _password, ...safeAdmin } = admin;
  return safeAdmin;
}

export function generateToken(adminId: string): string {
  return jwt.sign({ sub: adminId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export class AuthService {
  async login(email: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const token = generateToken(admin.id);

    await LogService.create({
      action: "LOGIN",
      entity: "Admin",
      entityId: admin.id,
      description: `Entrou na plataforma`,
      actor: admin.name,
      adminId: admin.id,
    });

    return {
      token,
      admin: sanitizeAdmin(admin),
    };
  }

  async me(adminId: string) {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });

    if (!admin) {
      throw new AppError("Administrador não encontrado", 404);
    }

    return sanitizeAdmin(admin);
  }

  async updateProfile(
    adminId: string,
    data: {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ) {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });

    if (!admin) {
      throw new AppError("Administrador não encontrado", 404);
    }

    const updateData: { name?: string; email?: string; password?: string } = {};

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.email && data.email !== admin.email) {
      const existing = await prisma.admin.findUnique({
        where: { email: data.email },
      });
      if (existing && existing.id !== adminId) {
        throw new AppError("E-mail já está em uso", 409);
      }
      updateData.email = data.email;
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new AppError("Senha atual é obrigatória para alterar a senha", 400);
      }
      const valid = await bcrypt.compare(data.currentPassword, admin.password);
      if (!valid) {
        throw new AppError("Senha atual incorreta", 401);
      }
      updateData.password = await bcrypt.hash(data.newPassword, 10);
    }

    const updated = await prisma.admin.update({
      where: { id: adminId },
      data: updateData,
    });

    if (data.newPassword) {
      await LogService.create({
        action: "PASSWORD_CHANGED",
        entity: "Admin",
        entityId: adminId,
        description: "Alterou a senha de acesso da conta",
        actor: updated.name,
        adminId,
      });
    }

    if (data.name || (data.email && data.email !== admin.email)) {
      await LogService.create({
        action: "PROFILE_UPDATED",
        entity: "Admin",
        entityId: adminId,
        description: `Atualizou os dados do perfil de administrador`,
        actor: updated.name,
        adminId,
      });
    }

    return sanitizeAdmin(updated);
  }
}
