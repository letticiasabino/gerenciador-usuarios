import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";
import prisma from "../config/database";
import { config } from "../config/env";
import bcrypt from "bcrypt";

describe("API de Autenticação", () => {
  beforeAll(async () => {
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        name: "Test Admin",
        email: "admin.auth@test.com",
        password: await bcrypt.hash("Admin@123", 10),
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/auth/login", () => {
    it("deve autenticar com credenciais válidas", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin.auth@test.com", password: "Admin@123" })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body.admin).toHaveProperty(
        "email",
        "admin.auth@test.com",
      );
      expect(response.body.admin).not.toHaveProperty("password");
    });

    it("deve rejeitar senha incorreta", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin.auth@test.com", password: "Errada@123" })
        .expect(401);

      expect(response.body.message).toBe("E-mail ou senha inválidos");
    });

    it("deve rejeitar e-mail inexistente", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "naoexiste@test.com", password: "Admin@123" })
        .expect(401);

      expect(response.body.message).toBe("E-mail ou senha inválidos");
    });

    it("deve retornar erro para dados inválidos", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({ email: "invalido", password: "" })
        .expect(400);
    });

    it("deve retornar 400 para corpo JSON inválido", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send("{email: invalido}")
        .expect(400);

      expect(response.body.status).toBe("error");
    });
  });

  describe("GET /api/auth/me", () => {
    it("deve retornar dados do administrador autenticado", async () => {
      const login = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin.auth@test.com", password: "Admin@123" });

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${login.body.token}`)
        .expect(200);

      expect(response.body.email).toBe("admin.auth@test.com");
      expect(response.body).not.toHaveProperty("password");
    });

    it("deve retornar 401 sem token", async () => {
      await request(app).get("/api/auth/me").expect(401);
    });

    it("deve retornar 401 com token inválido", async () => {
      await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer token-invalido")
        .expect(401);
    });

    it("deve retornar 401 para token sem identificador de usuário", async () => {
      const tokenWithoutSub = jwt.sign({ foo: "bar" }, config.jwtSecret, {
        expiresIn: "1h",
      });

      await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${tokenWithoutSub}`)
        .expect(401);
    });
  });

  describe("PUT /api/auth/profile", () => {
    it("deve atualizar o nome do administrador", async () => {
      const login = await request(app)
        .post("/api/auth/login")
        .send({ email: "admin.auth@test.com", password: "Admin@123" });

      const response = await request(app)
        .put("/api/auth/profile")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send({ name: "Nome Atualizado" })
        .expect(200);

      expect(response.body.name).toBe("Nome Atualizado");
    });
  });

  describe("Rotas inexistentes", () => {
    it("deve retornar 404 em JSON para rota desconhecida", async () => {
      const response = await request(app)
        .get("/api/rota-inexistente")
        .expect(404);

      expect(response.body).toHaveProperty("status", "error");
      expect(response.body).toHaveProperty("message");
    });
  });
});
