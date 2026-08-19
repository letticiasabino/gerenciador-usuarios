import {
  CalendarDays,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/utils";
import { NotificationsMenu } from "./NotificationsMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Você saiu da sua conta");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-dark-800 dark:bg-dark-900 sm:px-6 lg:px-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Abrir menu"
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-1.5 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Ir para o Calendário"
          title="Calendário de Atividades"
          onClick={() => navigate("/calendario")}
          className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-dark-800 dark:hover:text-slate-200"
        >
          <CalendarDays className="h-5 w-5" />
        </Button>

        <NotificationsMenu />

        <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-dark-800 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-full p-1 outline-none transition-colors hover:bg-slate-100 dark:hover:bg-dark-800 focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${admin?.email ?? "admin"}`}
                  alt={admin?.name ?? "Admin"}
                />
                <AvatarFallback>
                  {getInitials(admin?.name ?? "Admin")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden pr-1 text-left xl:block">
                <span className="block text-sm font-medium leading-tight text-slate-900 dark:text-slate-100">
                  {admin?.name ?? "Administrador"}
                </span>
                <span className="block text-xs leading-tight text-slate-500 dark:text-slate-400">
                  {admin?.email}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                {admin?.name ?? "Administrador"}
              </span>
              <span className="block truncate text-xs font-normal text-slate-500 dark:text-slate-400">
                {admin?.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/perfil")}>
              <UserRound className="h-4 w-4 mr-2" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
