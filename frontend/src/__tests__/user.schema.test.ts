import { describe, it, expect } from "vitest";
import { userFormSchema } from "../schemas/user.schema";

describe("userFormSchema", () => {
  const validInput = {
    fullName: "Maria Souza Silva",
    email: "maria.souza@empresa.com",
    password: "Senha@123",
    phone: "(11) 99999-9999",
    birthDate: "1995-05-15",
    city: "São Paulo",
    state: "SP",
    status: "ACTIVE" as const,
  };

  it("aceita dados válidos completos", () => {
    const result = userFormSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("aceita dados com endereço opcional", () => {
    const result = userFormSchema.safeParse({
      ...validInput,
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 101",
      neighborhood: "Centro",
      zipCode: "01234-567",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita nome com menos de 3 caracteres", () => {
    const result = userFormSchema.safeParse({
      ...validInput,
      fullName: "Ab",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const result = userFormSchema.safeParse({
      ...validInput,
      email: "email-invalido",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita telefone fora do formato esperado", () => {
    const result = userFormSchema.safeParse({
      ...validInput,
      phone: "11999999999",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita data de nascimento fora do padrão AAAA-MM-DD", () => {
    const result = userFormSchema.safeParse({
      ...validInput,
      birthDate: "15/05/1995",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita estado que não seja UF válida", () => {
    const result = userFormSchema.safeParse({
      ...validInput,
      state: "XYZ",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita status inválido", () => {
    const result = userFormSchema.safeParse({
      ...validInput,
      status: "INVALIDO",
    });
    expect(result.success).toBe(false);
  });
});
