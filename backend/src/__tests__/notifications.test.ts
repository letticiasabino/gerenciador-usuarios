import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import prisma from "../config/database";
import { generateToken } from "../services/auth.service";

describe("API de Notificações Persistidas", () => {
  let token: string;
  let adminId: string;
  let otherToken: string;
  let otherAdminId: string;

  beforeEach(async () => {
    await prisma.notification.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.admin.deleteMany();

    const admin = await prisma.admin.create({
      data: {
        name: "Admin Principal",
        email: "admin@test.com",
        password: "hashed_password",
      },
    });

    const otherAdmin = await prisma.admin.create({
      data: {
        name: "Outro Admin",
        email: "outro@test.com",
        password: "hashed_password",
      },
    });

    adminId = admin.id;
    token = generateToken(adminId);

    otherAdminId = otherAdmin.id;
    otherToken = generateToken(otherAdminId);
  });

  describe("GET /api/notifications", () => {
    it("deve rejeitar requisições sem token", async () => {
      const response = await request(app).get("/api/notifications");
      expect(response.status).toBe(401);
    });

    it("deve retornar lista de notificações e unreadCount", async () => {
      await prisma.notification.create({
        data: {
          title: "Notificação Teste",
          message: "Mensagem de teste",
          type: "info",
          adminId,
        },
      });

      const response = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.unreadCount).toBe(1);
      expect(response.body.data[0].title).toBe("Notificação Teste");
    });

    it("deve isolar notificações entre administradores", async () => {
      await prisma.notification.create({
        data: {
          title: "Notificação Admin 1",
          message: "Msg 1",
          adminId,
        },
      });

      await prisma.notification.create({
        data: {
          title: "Notificação Admin 2",
          message: "Msg 2",
          adminId: otherAdminId,
        },
      });

      const response1 = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${token}`);

      expect(response1.status).toBe(200);
      expect(response1.body.data.length).toBe(1);
      expect(response1.body.data[0].title).toBe("Notificação Admin 1");

      const response2 = await request(app)
        .get("/api/notifications")
        .set("Authorization", `Bearer ${otherToken}`);

      expect(response2.status).toBe(200);
      expect(response2.body.data.length).toBe(1);
      expect(response2.body.data[0].title).toBe("Notificação Admin 2");
    });
  });

  describe("PATCH /api/notifications/:id/read", () => {
    it("deve marcar notificação como lida", async () => {
      const notif = await prisma.notification.create({
        data: {
          title: "Lendo Notificação",
          message: "Teste",
          adminId,
        },
      });

      const response = await request(app)
        .patch(`/api/notifications/${notif.id}/read`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.isRead).toBe(true);
      expect(response.body.readAt).not.toBeNull();
    });

    it("não deve permitir marcar notificação de outro administrador", async () => {
      const notif = await prisma.notification.create({
        data: {
          title: "Privada",
          message: "Teste",
          adminId: otherAdminId,
        },
      });

      const response = await request(app)
        .patch(`/api/notifications/${notif.id}/read`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/notifications/read-all", () => {
    it("deve marcar todas as notificações do admin como lidas", async () => {
      await prisma.notification.createMany({
        data: [
          { title: "N1", message: "M1", adminId },
          { title: "N2", message: "M2", adminId },
          { title: "N3", message: "M3", adminId: otherAdminId },
        ],
      });

      const response = await request(app)
        .patch("/api/notifications/read-all")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);

      const unreadCountAdmin = await prisma.notification.count({
        where: { adminId, isRead: false },
      });
      expect(unreadCountAdmin).toBe(0);

      const unreadCountOther = await prisma.notification.count({
        where: { adminId: otherAdminId, isRead: false },
      });
      expect(unreadCountOther).toBe(1);
    });
  });

  describe("DELETE /api/notifications/:id", () => {
    it("deve excluir notificação com sucesso", async () => {
      const notif = await prisma.notification.create({
        data: {
          title: "Excluir",
          message: "Teste",
          adminId,
        },
      });

      const response = await request(app)
        .delete(`/api/notifications/${notif.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const exists = await prisma.notification.findUnique({
        where: { id: notif.id },
      });
      expect(exists).toBeNull();
    });
  });
});
