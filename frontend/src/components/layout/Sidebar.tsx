import {
  CalendarDays,
  FileClock,
  LogOut,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface NavItem {
  label: string;
  icon: typeof Users;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Usuários", icon: Users, path: "/" },
  { label: "Calendário", icon: CalendarDays, path: "/calendario" },
  { label: "Histórico", icon: FileClock, path: "/historico" },
  { label: "Perfil", icon: UserRound, path: "/perfil" },
  { label: "Configurações", icon: Settings, path: "/configuracoes" },
];

function SidebarContent({
  onLogout,
  onNavigate,
}: {
  onLogout: () => void;
  onNavigate: (item: NavItem) => void;
}) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full w-full flex-col items-center py-6">
      <button
        type="button"
        className="mb-8 flex flex-col items-center gap-2 outline-none cursor-pointer"
        onClick={() => onNavigate(NAV_ITEMS[0])}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/20 transition-all">
          <Users className="h-6 w-6 text-white" />
        </span>
        <span className="text-sm font-semibold tracking-wide text-white">
          UserManage
        </span>
      </button>

      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <Button
              key={item.label}
              type="button"
              variant="ghost"
              size="icon"
              title={item.label}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              onClick={() => onNavigate(item)}
              className={cn(
                "h-11 w-11 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all",
                active && "bg-white/20 text-white hover:bg-white/20 font-bold shadow-sm",
              )}
            >
              <Icon className="h-5 w-5" />
            </Button>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-1.5 border-t border-white/10 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Sair da Conta"
          aria-label="Sair"
          onClick={onLogout}
          className="h-11 w-11 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-200 transition-all"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const navigate = useNavigate();

  const handleNavigate = (item: NavItem) => {
    onClose();
    navigate(item.path);
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[90px] bg-[#103A66] lg:block shadow-lg">
        <SidebarContent onLogout={onLogout} onNavigate={handleNavigate} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "pointer-events-none hidden",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[220px] bg-[#103A66] transition-transform duration-300 lg:hidden shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-end p-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fechar menu"
            onClick={onClose}
            className="text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <SidebarContent onLogout={onLogout} onNavigate={handleNavigate} />
      </aside>
    </>
  );
}
