import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Users as UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { User, SortDirection, SortKey } from "@/types";
import { formatDate } from "@/utils";

import { StatusBadge } from "./StatusBadge";
import { UserActions } from "./UserActions";
import { UserAvatar } from "./UserAvatar";
import { UserRow } from "./UserRow";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (select: boolean) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  onView?: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetFilters: () => void;
}

interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  className?: string;
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  className,
}: SortableHeaderProps) {
  const active = activeKey === sortKey;
  const Icon = active
    ? direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ChevronsUpDown;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors",
          active
            ? "text-brand-600 dark:text-brand-400"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
        )}
      >
        {label}
        <Icon className="h-3.5 w-3.5" />
      </button>
    </TableHead>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-4 rounded" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="ml-auto h-8 w-16" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState({ onResetFilters }: { onResetFilters: () => void }) {
  return (
    <TableRow>
      <TableCell colSpan={8} className="h-56 p-8 text-center">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-dark-800">
            <UsersIcon className="h-7 w-7 text-slate-400 dark:text-slate-500" />
          </span>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Nenhum usuário encontrado
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tente ajustar a busca ou os filtros aplicados para encontrar o que procura.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
          >
            Limpar filtros
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function MobileUserCard({
  user,
  selected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: {
  user: User;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onView?: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  return (
    <li
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-dark-800 dark:bg-dark-900",
        selected &&
          "border-brand-300 bg-brand-50/40 dark:border-brand-500 dark:bg-brand-500/10",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect(user.id)}
            aria-label={`Selecionar ${user.fullName}`}
          />
          <UserAvatar user={user} className="h-10 w-10" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.fullName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </div>
        <StatusBadge status={user.status} />
      </div>
      <div className="mt-3 space-y-1 pl-7 text-xs text-slate-500 dark:text-slate-400">
        <p>Telefone: {user.phone}</p>
        <p>Localização: {user.city} - {user.state}</p>
        <p>Cadastrado em: {formatDate(user.createdAt)}</p>
      </div>
      <div className="mt-2 flex justify-end pl-7">
        <UserActions
          onView={onView ? () => onView(user) : undefined}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
        />
      </div>
    </li>
  );
}

export function UsersTable({
  users,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  sortKey,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
}: UsersTableProps) {
  const allSelected =
    users.length > 0 && users.every((user) => selectedIds.has(user.id));
  const someSelected =
    users.length > 0 && users.some((user) => selectedIds.has(user.id));

  return (
    <Card className="overflow-hidden">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 dark:bg-dark-800/60 dark:hover:bg-dark-800/60">
              <TableHead className="w-12">
                <Checkbox
                  checked={someSelected ? "indeterminate" : allSelected}
                  onCheckedChange={(checked) =>
                    onToggleSelectAll(checked === true)
                  }
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <SortableHeader
                label="Nome Completo"
                sortKey="fullName"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                label="E-mail"
                sortKey="email"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={onSort}
              />
              <TableHead>Telefone</TableHead>
              <TableHead>Cidade / UF</TableHead>
              <SortableHeader
                label="Status"
                sortKey="status"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={onSort}
              />
              <SortableHeader
                label="Data de Cadastro"
                sortKey="createdAt"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={onSort}
              />
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <LoadingRows />
            ) : users.length === 0 ? (
              <EmptyState onResetFilters={onResetFilters} />
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  selected={selectedIds.has(user.id)}
                  onToggleSelect={onToggleSelect}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-dark-800 md:hidden">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <UsersIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Nenhum usuário encontrado
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <MobileUserCard
                key={user.id}
                user={user}
                selected={selectedIds.has(user.id)}
                onToggleSelect={onToggleSelect}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
