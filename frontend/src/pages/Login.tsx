import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, LogIn, Users } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      toast.success("Login realizado com sucesso!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao entrar no sistema",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 p-4">
      <div className="animate-float pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary-600/30 blur-3xl" />
      <div className="animate-float-slow pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div
        className="animate-float pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
        style={{ animationDelay: "-3s" }}
      />

      <div className="relative w-full max-w-md">
        <div className="animate-slide-up mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-900/40">
            <Users className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">Gerenciamento</h1>
          <p className="mt-1 text-sm text-gray-400">
            Painel de controle de usuários
          </p>
        </div>

        <div
          className="animate-scale-in rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur"
          style={{ animationDelay: "150ms" }}
        >
          <h2 className="text-lg font-semibold text-white">Entrar</h2>
          <p className="mt-1 text-sm text-gray-400">
            Acesse o painel com suas credenciais
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder:text-gray-500 transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                    errors.email ? "border-red-400" : ""
                  }`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={`w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 transition-all focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                    errors.password ? "border-red-400" : ""
                  }`}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-900/40 transition-all duration-200 hover:-translate-y-px hover:from-primary-700 hover:to-primary-600 hover:shadow-xl hover:shadow-primary-900/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-900 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-3 text-center">
            <p className="text-xs text-gray-400">Credenciais de demonstração</p>
            <p className="mt-1 text-xs text-gray-300">
              admin@gerenciamento.com · Admin@2026
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Projeto Individual DFS-2026.2 · Lettícia Sabino
        </p>
      </div>
    </div>
  );
}
