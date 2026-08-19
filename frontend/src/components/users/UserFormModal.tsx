import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  userFormSchema,
  type UserFormData,
} from "@/schemas/user.schema";
import type { User, CreateUserInput, UpdateUserInput } from "@/types";
import { BRAZILIAN_STATES, formatPhone, formatZipCode } from "@/utils";

interface UserFormModalProps {
  user?: User | null;
  onClose: () => void;
  onSubmit: (values: CreateUserInput | UpdateUserInput) => Promise<void>;
}

export function UserFormModal({ user, onClose, onSubmit }: UserFormModalProps) {
  const isEditing = Boolean(user);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      password: "",
      phone: user?.phone ?? "",
      birthDate: user?.birthDate ?? "",
      street: user?.street ?? "",
      number: user?.number ?? "",
      complement: user?.complement ?? "",
      neighborhood: user?.neighborhood ?? "",
      city: user?.city ?? "",
      state: (user?.state as typeof BRAZILIAN_STATES[number]) ?? "SP",
      zipCode: user?.zipCode ?? "",
      status: (user?.status as "ACTIVE" | "INACTIVE") ?? "ACTIVE",
    },
  });

  const handleFormSubmit = async (values: UserFormData) => {
    try {
      const payload: CreateUserInput | UpdateUserInput = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        birthDate: values.birthDate,
        street: values.street || null,
        number: values.number || null,
        complement: values.complement || null,
        neighborhood: values.neighborhood || null,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode || null,
        status: values.status,
      };

      if (!isEditing) {
        if (!values.password) {
          toast.error("A senha é obrigatória para novos usuários");
          return;
        }
        (payload as CreateUserInput).password = values.password;
      } else if (values.password && values.password.trim() !== "") {
        (payload as UpdateUserInput).password = values.password;
      }

      await onSubmit(payload);
      toast.success(
        isEditing
          ? `Dados de ${values.fullName} atualizados`
          : `${values.fullName} cadastrado(a) com sucesso`,
      );
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar usuário",
      );
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isEditing ? "Editar Usuário" : "Novo Usuário"}
      description={
        isEditing
          ? "Atualize as informações do usuário no banco de dados."
          : "Preencha os dados para cadastrar um novo usuário no sistema."
      }
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="user-form" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-1.5" />
            {isSubmitting
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Cadastrar usuário"}
          </Button>
        </>
      }
    >
      <form
        id="user-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Nome Completo *
            </label>
            <Input
              id="fullName"
              placeholder="Ex.: Maria Souza Silva"
              {...register("fullName")}
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              E-mail *
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Ex.: maria@empresa.com"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {isEditing ? "Nova Senha (opcional)" : "Senha *"}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={isEditing ? "Deixe em branco para manter" : "Mínimo 8 caracteres (Ex: Senha@123)"}
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Telefone *
            </label>
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              {...register("phone", {
                onChange: (e) => {
                  setValue("phone", formatPhone(e.target.value));
                },
              })}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="birthDate"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Data de Nascimento *
            </label>
            <Input
              id="birthDate"
              type="date"
              {...register("birthDate")}
              aria-invalid={Boolean(errors.birthDate)}
            />
            {errors.birthDate && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.birthDate.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 border-b pb-1 pt-2">
              Endereço e Localização
            </h3>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="street"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Rua / Logradouro
            </label>
            <Input
              id="street"
              placeholder="Ex.: Rua das Flores"
              {...register("street")}
            />
          </div>

          <div>
            <label
              htmlFor="number"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Número
            </label>
            <Input
              id="number"
              placeholder="Ex.: 123"
              {...register("number")}
            />
          </div>

          <div>
            <label
              htmlFor="complement"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Complemento
            </label>
            <Input
              id="complement"
              placeholder="Ex.: Apto 101"
              {...register("complement")}
            />
          </div>

          <div>
            <label
              htmlFor="neighborhood"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Bairro
            </label>
            <Input
              id="neighborhood"
              placeholder="Ex.: Centro"
              {...register("neighborhood")}
            />
          </div>

          <div>
            <label
              htmlFor="zipCode"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              CEP
            </label>
            <Input
              id="zipCode"
              placeholder="01234-567"
              {...register("zipCode", {
                onChange: (e) => {
                  setValue("zipCode", formatZipCode(e.target.value));
                },
              })}
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Cidade *
            </label>
            <Input
              id="city"
              placeholder="Ex.: São Paulo"
              {...register("city")}
              aria-invalid={Boolean(errors.city)}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Estado (UF) *
            </label>
            <Controller
              control={control}
              name="state"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="state" aria-invalid={Boolean(errors.state)}>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {BRAZILIAN_STATES.map((uf) => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.state && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Status *
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="status"
                    aria-invalid={Boolean(errors.status)}
                  >
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="INACTIVE">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
