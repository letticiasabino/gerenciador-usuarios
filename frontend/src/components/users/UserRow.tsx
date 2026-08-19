import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { formatDate } from "@/utils";

import { StatusBadge } from "./StatusBadge";
import { UserActions } from "./UserActions";
import { UserAvatar } from "./UserAvatar";

interface UserRowProps {
  user: User;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onView?: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserRow({
  user,
  selected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: UserRowProps) {
  return (
    <TableRow className={cn(selected && "bg-brand-50/50 dark:bg-brand-500/10")}>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(user.id)}
          aria-label={`Selecionar ${user.fullName}`}
        />
      </TableCell>
      <TableCell>
        <button
          type="button"
          onClick={() => onView && onView(user)}
          className="flex items-center gap-3 text-left hover:underline"
        >
          <UserAvatar user={user} className="h-9 w-9" />
          <span className="whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
            {user.fullName}
          </span>
        </button>
      </TableCell>
      <TableCell className="whitespace-nowrap text-slate-500 dark:text-slate-400">
        {user.email}
      </TableCell>
      <TableCell className="whitespace-nowrap text-slate-500 dark:text-slate-400">
        {user.phone}
      </TableCell>
      <TableCell className="whitespace-nowrap text-slate-500 dark:text-slate-400">
        {user.city} - {user.state}
      </TableCell>
      <TableCell>
        <StatusBadge status={user.status} />
      </TableCell>
      <TableCell className="whitespace-nowrap text-slate-500 dark:text-slate-400">
        {formatDate(user.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <UserActions
          onView={onView ? () => onView(user) : undefined}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
        />
      </TableCell>
    </TableRow>
  );
}
