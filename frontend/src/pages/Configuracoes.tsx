import { useEffect, useState } from "react";
import {
  Bell,
  Globe,
  LogOut,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";

const SETTINGS_KEY = "gerenciador-usuarios:settings";

interface Settings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklySummary: boolean;
  language: string;
}

const DEFAULT_SETTINGS: Settings = {
  emailNotifications: true,
  pushNotifications: true,
  weeklySummary: false,
  language: "pt-BR",
};

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function Configuracoes() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
    toast.success("Preferência atualizada", { id: "settings-toast" });
  };

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada com sucesso");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Configurações do Sistema
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie tema, preferências de notificação e opções da plataforma.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserRound className="h-5 w-5 text-brand-600" />
              Conta e Perfil
            </CardTitle>
            <CardDescription>
              Dados da conta administradora atualmente autenticada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${admin?.email || "admin"}`}
                  alt={admin?.name ?? "Admin"}
                />
                <AvatarFallback>{getInitials(admin?.name ?? "Admin")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-slate-900 dark:text-slate-100">
                  {admin?.name ?? "Administrador"}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {admin?.email}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                  <ShieldCheck className="h-3 w-3" />
                  Administrador
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/perfil")}
              >
                Gerenciar Perfil e Senha
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-brand-600" />
              Aparência do Tema
            </CardTitle>
            <CardDescription>
              Alterne entre o tema claro e o modo escuro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => theme === "dark" && toggleTheme()}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                  theme === "light"
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500 dark:bg-brand-500/15"
                    : "border-slate-200 hover:border-slate-300 dark:border-dark-700 dark:hover:border-dark-600",
                )}
                aria-pressed={theme === "light"}
              >
                <Sun className="h-6 w-6 text-amber-500" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Claro
                </span>
                {theme === "light" && (
                  <span className="text-xs font-semibold text-brand-600">Ativo</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => theme === "light" && toggleTheme()}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                  theme === "dark"
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500 dark:bg-brand-500/15"
                    : "border-slate-200 hover:border-slate-300 dark:border-dark-700 dark:hover:border-dark-600",
                )}
                aria-pressed={theme === "dark"}
              >
                <Moon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Escuro
                </span>
                {theme === "dark" && (
                  <span className="text-xs font-semibold text-brand-600">Ativo</span>
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-brand-600" />
              Notificações
            </CardTitle>
            <CardDescription>
              Controle alertas de atividades e compromissos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Alertas de Atividades
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Avisos sobre atividades e reuniões agendadas.
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSetting("pushNotifications", checked)
                }
                aria-label="Alertas de atividades"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Notificações por e-mail
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Receba avisos de segurança no seu e-mail cadastrado.
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSetting("emailNotifications", checked)
                }
                aria-label="Notificações por e-mail"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-brand-600" />
              Idioma e Região
            </CardTitle>
            <CardDescription>
              Configuração de idioma da plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={settings.language}
              onValueChange={(value) => setSetting("language", value)}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formatação de datas e moedas seguirá o padrão brasileiro (pt-BR).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
