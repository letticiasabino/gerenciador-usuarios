import { z } from "zod";
import { BRAZILIAN_STATES } from "../utils";

const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const userFormSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres"),
  email: z.string().email("E-mail inválido").toLowerCase(),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial")
    .optional()
    .or(z.literal("")),
  phone: z.string().regex(phoneRegex, "Formato esperado: (11) 99999-9999"),
  birthDate: z
    .string()
    .regex(birthDateRegex, "Data deve estar no formato AAAA-MM-DD")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Data de nascimento inválida",
    }),
  street: z.string().optional().nullable(),
  number: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().optional().nullable(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.enum(BRAZILIAN_STATES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Selecione um estado válido" }),
  }),
  zipCode: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Selecione o status" }),
  }),
});

export type UserFormData = z.infer<typeof userFormSchema>;
