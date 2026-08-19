import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import prisma from "../config/database";
import bcrypt from "bcrypt";

let token: string;

function auth(req: request.Test) {
  return req.set("Authorization", `Bearer ${token}`);
}

describe("API de Usuários", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.admin.create({
      data: {
        name: "Test Admin",
        email: "admin@test.com",
        password: await bcrypt.hash("Admin@123", 10),
      },
    });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "Admin@123" });
    token = login.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  const validUser = {
    fullName: "Usuário Teste",
    email: "teste@email.com",
    password: "Senha@123",
    phone: "(11) 99999-9999",
    birthDate: "1995-05-15",
    city: "São Paulo",
    state: "SP",
    status: "ACTIVE",
  };

  describe("POST /api/users", () => {
    it("deve cadastrar um novo usuário", async () => {
      const response = await auth(
        request(app).post("/api/users").send(validUser),
      ).expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.fullName).toBe(validUser.fullName);
      expect(response.body.email).toBe(validUser.email.toLowerCase());
      expect(response.body).not.toHaveProperty("password");
    });

    it("deve rejeitar e-mail duplicado", async () => {
      await auth(request(app).post("/api/users").send(validUser));

      const response = await auth(
        request(app).post("/api/users").send(validUser),
      ).expect(409);

      expect(response.body.message).toBe("E-mail já cadastrado");
    });

    it("deve retornar erro para dados inválidos", async () => {
      const response = await auth(
        request(app).post("/api/users").send({ email: "invalido" }),
      ).expect(400);

      expect(response.body.status).toBe("error");
    });

    it("deve retornar 401 sem token", async () => {
      await request(app).post("/api/users").send(validUser).expect(401);
    });
  });

  describe("GET /api/users", () => {
    it("deve listar usuários", async () => {
      await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      const response = await auth(request(app).get("/api/users")).expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("não deve retornar senha na listagem", async () => {
      await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      const response = await auth(request(app).get("/api/users")).expect(200);

      if (response.body.data.length > 0) {
        expect(response.body.data[0]).not.toHaveProperty("password");
      }
    });

    it("deve aplicar paginação, busca e filtros", async () => {
      await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      const response = await auth(
        request(app)
          .get("/api/users")
          .query({
            page: 1,
            limit: 5,
            search: "Usuário",
            status: "ACTIVE",
            sortBy: "createdAt",
            order: "desc",
          }),
      ).expect(200);

      expect(response.body.pagination).toHaveProperty("page", 1);
      expect(response.body.pagination).toHaveProperty("limit", 5);
    });

    it("deve rejeitar limite acima do máximo permitido", async () => {
      await auth(request(app).get("/api/users").query({ limit: 101 })).expect(
        400,
      );
    });
  });

  describe("GET /api/users/:id", () => {
    it("deve buscar um usuário por ID", async () => {
      const user = await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      const response = await auth(
        request(app).get(`/api/users/${user.id}`),
      ).expect(200);

      expect(response.body.fullName).toBe(validUser.fullName);
      expect(response.body).not.toHaveProperty("password");
    });

    it("deve retornar 404 para usuário inexistente", async () => {
      await auth(request(app).get("/api/users/id-inexistente")).expect(404);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("deve atualizar um usuário", async () => {
      const user = await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      const response = await auth(
        request(app)
          .put(`/api/users/${user.id}`)
          .send({ fullName: "Nome Atualizado" }),
      ).expect(200);

      expect(response.body.fullName).toBe("Nome Atualizado");
    });

    it("deve atualizar a senha quando informada", async () => {
      const user = await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      const response = await auth(
        request(app)
          .put(`/api/users/${user.id}`)
          .send({ password: "NovaSenha@123" }),
      ).expect(200);

      expect(response.body).not.toHaveProperty("password");

      const stored = await prisma.user.findUnique({ where: { id: user.id } });
      const valid = await bcrypt.compare("NovaSenha@123", stored!.password);
      expect(valid).toBe(true);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("deve excluir um usuário", async () => {
      const user = await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      await auth(request(app).delete(`/api/users/${user.id}`)).expect(204);

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(deletedUser).toBeNull();
    });

    it("deve retornar 404 ao excluir usuário inexistente", async () => {
      await auth(request(app).delete("/api/users/id-inexistente")).expect(404);
    });
  });

  describe("PATCH /api/users/:id/status", () => {
    it("deve atualizar o status de um usuário", async () => {
      const user = await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      const response = await auth(
        request(app)
          .patch(`/api/users/${user.id}/status`)
          .send({ status: "INACTIVE" }),
      ).expect(200);

      expect(response.body.status).toBe("INACTIVE");
    });

    it("deve retornar 404 para usuário inexistente", async () => {
      await auth(
        request(app)
          .patch("/api/users/id-inexistente/status")
          .send({ status: "ACTIVE" }),
      ).expect(404);
    });

    it("deve rejeitar status inválido", async () => {
      const user = await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      await auth(
        request(app)
          .patch(`/api/users/${user.id}/status`)
          .send({ status: "BLOQUEADO" }),
      ).expect(400);
    });
  });

  describe("GET /api/users/stats", () => {
    it("deve retornar estatísticas", async () => {
      await prisma.user.create({
        data: {
          ...validUser,
          password: await bcrypt.hash("Senha@123", 10),
          email: "teste@email.com",
        },
      });

      const response = await auth(request(app).get("/api/users/stats")).expect(
        200,
      );

      expect(response.body).toHaveProperty("totalUsers");
      expect(response.body).toHaveProperty("activeUsers");
      expect(response.body).toHaveProperty("inactiveUsers");
      expect(response.body).toHaveProperty("recentUsers");
      expect(response.body).toHaveProperty("birthdaysThisMonth");
    });
  });
});
