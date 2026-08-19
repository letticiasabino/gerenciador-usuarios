import { useCallback, useEffect, useState } from "react";
import { Trash2, UsersRound, X } from "lucide-react";
import toast from "react-hot-toast";

import { Filters } from "@/components/dashboard/Filters";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/users/Pagination";
import { UserDetailsModal } from "@/components/users/UserDetailsModal";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UsersTable } from "@/components/users/UsersTable";
import { useDebounce } from "@/hooks/useDebounce";
import { userService } from "@/services/api";
import type {
  CreateUserInput,
  SortDirection,
  SortKey,
  UpdateUserInput,
  User,
  UserStats,
} from "@/types";

const PAGE_SIZE = 8;

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await userService.getStats();
      setStats(data);
    } catch {
      // Falha ao carregar estatísticas
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.findAll({
        page,
        limit: PAGE_SIZE,
        search: debouncedQuery.trim() || undefined,
        status: status === "ALL" ? undefined : status,
        sortBy: sortKey,
        order: sortDirection,
      });

      setUsers(response.data);
      setTotalItems(response.pagination.totalItems);
      setTotalPages(Math.max(1, response.pagination.totalPages));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao carregar usuários da API",
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQuery, status, sortKey, sortDirection]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, status]);

  const handleCreate = async (values: CreateUserInput | UpdateUserInput) => {
    await userService.create(values as CreateUserInput);
    await Promise.all([fetchUsers(), fetchStats()]);
  };

  const handleUpdate = async (values: CreateUserInput | UpdateUserInput) => {
    if (!editingUser) return;
    await userService.update(editingUser.id, values as UpdateUserInput);
    await Promise.all([fetchUsers(), fetchStats()]);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await userService.delete(deletingUser.id);
      toast.success(`${deletingUser.fullName} removido(a) com sucesso`);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingUser.id);
        return next;
      });
      setDeletingUser(null);
      await Promise.all([fetchUsers(), fetchStats()]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao excluir usuário",
      );
    }
  };

  const handleConfirmBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map((id) => userService.delete(id)));
      toast.success(`${ids.length} usuário(s) removido(s) com sucesso`);
      setSelectedIds(new Set());
      setIsBulkDeleteOpen(false);
      await Promise.all([fetchUsers(), fetchStats()]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao excluir usuários selecionados",
      );
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = (select: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      users.forEach((user) => {
        if (select) {
          next.add(user.id);
        } else {
          next.delete(user.id);
        }
      });
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const resetFilters = () => {
    setQuery("");
    setStatus("ALL");
    setPage(1);
  };

  const selectedCount = selectedIds.size;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Gerenciador de Usuários
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie, filtre e acompanhe todos os usuários cadastrados na API em um só lugar.
        </p>
      </div>

      <StatsCards stats={stats} loading={statsLoading} />

      <Filters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        onNewUser={() => setIsCreateOpen(true)}
      />

      <div className="space-y-3">
        {!loading && selectedCount > 0 && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50/70 px-4 py-3 dark:border-brand-500/30 dark:bg-brand-500/10">
            <p className="flex items-center gap-2 text-sm font-medium text-brand-700 dark:text-brand-300">
              <UsersRound className="h-4 w-4" />
              {selectedCount} usuário(s) selecionado(s)
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-brand-700 hover:bg-brand-100/70 dark:text-brand-300 dark:hover:bg-brand-500/20"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar seleção
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        )}

        <UsersTable
          users={users}
          loading={loading}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={toggleSort}
          onView={setViewingUser}
          onEdit={setEditingUser}
          onDelete={setDeletingUser}
          onResetFilters={resetFilters}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {viewingUser && (
        <UserDetailsModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          onEdit={(user) => {
            setViewingUser(null);
            setEditingUser(user);
          }}
        />
      )}

      {isCreateOpen && (
        <UserFormModal
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingUser && (
        <UserFormModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdate}
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        title="Excluir usuário"
        description={`Tem certeza que deseja excluir "${deletingUser?.fullName}"? Esta ação não pode ser desfeita e removerá o usuário do banco de dados.`}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        title="Excluir usuários"
        description={`Tem certeza que deseja excluir ${selectedCount} usuário(s) selecionado(s)? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmBulkDelete}
      />
    </div>
  );
}
