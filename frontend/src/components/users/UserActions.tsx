import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserActionsProps {
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserActions({ onView, onEdit, onDelete }: UserActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Visualizar detalhes"
              onClick={onView}
              className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-dark-800"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Visualizar</TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Editar usuário"
            onClick={onEdit}
            className="h-8 w-8 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/15"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Excluir usuário"
            onClick={onDelete}
            className="h-8 w-8 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Excluir</TooltipContent>
      </Tooltip>
    </div>
  );
}
