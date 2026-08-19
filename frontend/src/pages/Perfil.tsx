import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  KeyRound,
  Lock,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/api";
import { formatDate, getInitials } from "@/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido").toLowerCase(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "Nova senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Deve conter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "Deve conter pelo menos um caractere especial"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function Perfil() {
  const { admin } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: admin?.name ?? "Administrador",
      email: admin?.email ?? "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onUpdateProfile = async (values: ProfileFormData) => {
    try {
      setSavingProfile(true);
      await authService.updateProfile({
        name: values.name,
        email: values.email,
      });
      toast.success("Dados do perfil atualizados com sucesso");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao atualizar perfil",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const onUpdatePassword = async (values: PasswordFormData) => {
    try {
      setSavingPassword(true);
      await authService.updateProfile({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Senha alterada com sucesso");
      resetPasswordForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao alterar senha",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Meu Perfil
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Visualize e gerencie suas informações de acesso e credenciais de administrador.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Identificação
            </CardTitle>
            <CardDescription>
              Dados da conta administradora ativa.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 shadow-md">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${admin?.email ?? "admin"}`}
                alt={admin?.name ?? "Admin"}
              />
              <AvatarFallback className="text-xl">
                {getInitials(admin?.name ?? "Admin")}
              </AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              {admin?.name ?? "Administrador"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {admin?.email}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <ShieldCheck className="h-4 w-4" />
              Administrador do Sistema
            </div>

            <div className="mt-6 w-full space-y-3 border-t pt-4 text-left text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Nível de Acesso:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Total (Full Stack)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Autenticação:</span>
                <span className="font-semibold text-green-600">
                  JWT Ativo
                </span>
              </div>
              {admin?.createdAt && (
                <div className="flex justify-between">
                  <span>Criado em:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {formatDate(admin.createdAt)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <UserRound className="h-5 w-5 text-brand-600" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Atualize seu nome de exibição e e-mail de acesso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleProfileSubmit(onUpdateProfile)}
                className="space-y-4"
                noValidate
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Nome Completo *
                    </label>
                    <Input
                      id="profile-name"
                      {...registerProfile("name")}
                      aria-invalid={Boolean(profileErrors.name)}
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {profileErrors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      E-mail *
                    </label>
                    <Input
                      id="profile-email"
                      type="email"
                      {...registerProfile("email")}
                      aria-invalid={Boolean(profileErrors.email)}
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {profileErrors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={savingProfile}>
                    <Save className="h-4 w-4 mr-1.5" />
                    {savingProfile ? "Salvando..." : "Salvar Dados"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <KeyRound className="h-5 w-5 text-brand-600" />
                Segurança e Senha
              </CardTitle>
              <CardDescription>
                Altere sua senha de acesso ao sistema com validação segura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handlePasswordSubmit(onUpdatePassword)}
                className="space-y-4"
                noValidate
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Senha Atual *
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Digite sua senha atual"
                    {...registerPassword("currentPassword")}
                    aria-invalid={Boolean(passwordErrors.currentPassword)}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Nova Senha *
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      {...registerPassword("newPassword")}
                      aria-invalid={Boolean(passwordErrors.newPassword)}
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Confirmar Nova Senha *
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repita a nova senha"
                      {...registerPassword("confirmPassword")}
                      aria-invalid={Boolean(passwordErrors.confirmPassword)}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={savingPassword}
                  >
                    <Lock className="h-4 w-4 mr-1.5" />
                    {savingPassword ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
