import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import prisma from "../config/database";
import { generateToken } from "../services/auth.service";

describe("API de Logs e Auditoria", () => {
  let token: string;
  let adminId: string;

  beforeEach(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.user.deleteMany();
    await prisma.admin.deleteMany();

    const admin = await prisma.admin.create({
      data: {
        name: "Admin Tester",
        email: "admin@test.com",
        password: "hashed_password",
      },
    });

    adminId = admin.id;
    token = generateToken(adminId);
  });

  describe("GET /api/logs", () => {
    it("deve rejeitar acesso sem token", async () => {
      const response = await request(app).get("/api/logs");
      expect(response.status).toBe(401);
    });

    it("deve retornar lista vazia de logs inicialmente", async () => {
      const response = await request(app)
        .get("/api/logs")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.totalItems).toBe(0);
    });
  });

  describe("Auditoria de Usuários", () => {
    it("deve registrar log ao criar, atualizar, mudar status e excluir usuário", async () => {
      // 1. Criar usuário
      const createRes = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          fullName: "Auditoria User",
          email: "auditoria@user.com",
          password: "Password123!",
          phone: "(11) 98765-4321",
          birthDate: "1995-05-15",
          city: "São Paulo",
          state: "SP",
        });

      expect(createRes.status).toBe(201);
      const userId = createRes.body.id;

      // 2. Atualizar usuário
      const updateRes = await request(app)
        .put(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          fullName: "Auditoria User Atualizado",
        });
      expect(updateRes.status).toBe(200);

      // 3. Mudar status
      const statusRes = await request(app)
        .patch(`/api/users/${userId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "INACTIVE" });
      expect(statusRes.status).toBe(200);

      // 4. Excluir usuário
      const deleteRes = await request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(deleteRes.status).toBe(204);

      // 5. Consultar logs
      const logsRes = await request(app)
        .get("/api/logs?entity=User")
        .set("Authorization", `Bearer ${token}`);

      expect(logsRes.status).toBe(200);
      expect(logsRes.body.data.length).toBe(4);
      const actions = logsRes.body.data.map((l: { action: string }) => l.action);
      expect(actions).toContain("USER_CREATED");
      expect(actions).toContain("USER_UPDATED");
      expect(actions).toContain("USER_STATUS_CHANGED");
      expect(actions).toContain("USER_DELETED");
    });
  });

  describe("Auditoria de Atividades", () => {
    it("deve registrar log ao criar, atualizar, mudar status e excluir atividade", async () => {
      // 1. Criar atividade
      const createRes = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Reunião de Auditoria",
          date: "2026-08-25",
          startTime: "10:00",
          priority: "HIGH",
        });

      expect(createRes.status).toBe(201);
      const actId = createRes.body.id;

      // 2. Atualizar atividade
      const updateRes = await request(app)
        .put(`/api/activities/${actId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Reunião de Auditoria Atualizada",
        });
      expect(updateRes.status).toBe(200);

      // 3. Mudar status
      const statusRes = await request(app)
        .patch(`/api/activities/${actId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "COMPLETED" });
      expect(statusRes.status).toBe(200);

      // 4. Excluir atividade
      const deleteRes = await request(app)
        .delete(`/api/activities/${actId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(deleteRes.status).toBe(204);

      // 5. Consultar logs
      const logsRes = await request(app)
        .get("/api/logs?entity=Activity")
        .set("Authorization", `Bearer ${token}`);

      expect(logsRes.status).toBe(200);
      expect(logsRes.body.data.length).toBe(4);
      const actions = logsRes.body.data.map((l: { action: string }) => l.action);
      expect(actions).toContain("ACTIVITY_CREATED");
      expect(actions).toContain("ACTIVITY_UPDATED");
      expect(actions).toContain("ACTIVITY_STATUS_CHANGED");
      expect(actions).toContain("ACTIVITY_DELETED");
    });
  });
});
