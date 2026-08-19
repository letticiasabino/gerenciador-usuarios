import { z } from "zod";

const addressSchema = z.object({
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z
    .string()
    .min(2, "Estado é obrigatório")
    .max(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().optional().nullable(),
});

const phoneSchema = z
  .string()
  .regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, "Formato de telefone inválido");

const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato AAAA-MM-DD")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Data de nascimento inválida",
  });

export const createUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  email: z.string().email("E-mail inválido").toLowerCase(),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "Senha deve conter pelo menos um caractere especial",
    ),
  phone: phoneSchema,
  birthDate: birthDateSchema,
  ...addressSchema.shape,
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres")
    .optional(),
  email: z.string().email("E-mail inválido").toLowerCase().optional(),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial")
    .optional()
    .or(z.literal("")),
  phone: phoneSchema.optional(),
  birthDate: birthDateSchema.optional(),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().min(1, "Cidade é obrigatória").optional(),
  state: z.string().min(2, "Estado é obrigatório").max(2).optional(),
  zipCode: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const queryUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional().default(""),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  sortBy: z
    .enum(["fullName", "email", "createdAt", "status"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type QueryUsersInput = z.infer<typeof queryUsersSchema>;
