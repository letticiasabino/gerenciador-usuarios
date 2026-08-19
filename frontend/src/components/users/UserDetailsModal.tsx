import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { User } from "@/types";
import { formatDate, formatDateTime, formatRelativeTime } from "@/utils";
import { StatusBadge } from "./StatusBadge";
import { UserAvatar } from "./UserAvatar";

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
  onEdit: (user: User) => void;
}

export function UserDetailsModal({
  user,
  onClose,
  onEdit,
}: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Modal
      open
      onClose={onClose}
      title="Detalhes do Usuário"
      description="Visualização completa das informações cadastrais do usuário."
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button
            type="button"
            onClick={() => {
              onClose();
              onEdit(user);
            }}
          >
            <Pencil className="h-4 w-4 mr-1.5" />
            Editar Dados
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-dark-800 dark:bg-dark-800/50">
          <UserAvatar user={user} className="h-16 w-16 shadow-sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {user.fullName}
              </h3>
              <StatusBadge status={user.status} />
            </div>
            <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1 rounded-lg border p-3 dark:border-dark-800">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Phone className="h-3.5 w-3.5" />
              Telefone
            </span>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.phone || "Não informado"}
            </p>
          </div>

          <div className="space-y-1 rounded-lg border p-3 dark:border-dark-800">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              Data de Nascimento
            </span>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {formatDate(user.birthDate) || "Não informada"}
            </p>
          </div>

          <div className="space-y-1 rounded-lg border p-3 dark:border-dark-800 sm:col-span-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              Endereço Completo
            </span>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.street
                ? `${user.street}${user.number ? `, nº ${user.number}` : ""}${user.complement ? ` - ${user.complement}` : ""}${user.neighborhood ? `, Bairro ${user.neighborhood}` : ""}`
                : "Logradouro não informado"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.city} - {user.state} {user.zipCode ? `· CEP: ${user.zipCode}` : ""}
            </p>
          </div>

          <div className="space-y-1 rounded-lg border p-3 dark:border-dark-800">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              Cadastrado em
            </span>
            <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
              {formatDateTime(user.createdAt)} ({formatRelativeTime(user.createdAt)})
            </p>
          </div>

          <div className="space-y-1 rounded-lg border p-3 dark:border-dark-800">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              Última Atualização
            </span>
            <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
              {formatDateTime(user.updatedAt)} ({formatRelativeTime(user.updatedAt)})
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
