import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido").toLowerCase(),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  email: z.string().email("E-mail inválido").toLowerCase().optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, "Nova senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial")
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
