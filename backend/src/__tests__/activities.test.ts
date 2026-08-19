import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import prisma from "../config/database";
import bcrypt from "bcrypt";

let token: string;

function auth(req: request.Test) {
  return req.set("Authorization", `Bearer ${token}`);
}

describe("API de Atividades", () => {
  beforeAll(async () => {
    await prisma.activity.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        name: "Admin Atividades",
        email: "admin.activities@test.com",
        password: await bcrypt.hash("Admin@123", 10),
      },
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin.activities@test.com", password: "Admin@123" });
    token = login.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.activity.deleteMany();
  });

  const validActivity = {
    title: "Reunião de Planejamento",
    description: "Alinhamento das metas da sprint",
    date: "2026-08-20",
    startTime: "10:00",
    endTime: "11:30",
    status: "PENDING",
    priority: "HIGH",
  };

  describe("POST /api/activities", () => {
    it("deve criar uma nova atividade", async () => {
      const response = await auth(
        request(app).post("/api/activities").send(validActivity),
      ).expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(validActivity.title);
      expect(response.body.date).toBe(validActivity.date);
    });

    it("deve rejeitar atividade sem título ou data", async () => {
      await auth(
        request(app).post("/api/activities").send({ title: "Ab" }),
      ).expect(400);
    });
  });

  describe("GET /api/activities", () => {
    it("deve listar atividades cadastradas", async () => {
      await auth(request(app).post("/api/activities").send(validActivity));

      const response = await auth(
        request(app).get("/api/activities"),
      ).expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });

    it("deve filtrar atividades por mês", async () => {
      await auth(request(app).post("/api/activities").send(validActivity));
      await auth(
        request(app).post("/api/activities").send({
          ...validActivity,
          title: "Atividade em Setembro",
          date: "2026-09-10",
        }),
      );

      const response = await auth(
        request(app).get("/api/activities?month=2026-08"),
      ).expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("Reunião de Planejamento");
    });
  });

  describe("PUT /api/activities/:id", () => {
    it("deve atualizar os dados de uma atividade", async () => {
      const created = await auth(
        request(app).post("/api/activities").send(validActivity),
      );

      const response = await auth(
        request(app)
          .put(`/api/activities/${created.body.id}`)
          .send({ title: "Título Atualizado" }),
      ).expect(200);

      expect(response.body.title).toBe("Título Atualizado");
    });
  });

  describe("DELETE /api/activities/:id", () => {
    it("deve excluir uma atividade", async () => {
      const created = await auth(
        request(app).post("/api/activities").send(validActivity),
      );

      await auth(
        request(app).delete(`/api/activities/${created.body.id}`),
      ).expect(204);

      await auth(
        request(app).get(`/api/activities/${created.body.id}`),
      ).expect(404);
    });
  });
});
