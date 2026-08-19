import { Search, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  status: "ALL" | "ACTIVE" | "INACTIVE";
  onStatusChange: (value: "ALL" | "ACTIVE" | "INACTIVE") => void;
  onNewUser: () => void;
}

export function Filters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  onNewUser,
}: FiltersProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9"
            aria-label="Buscar usuários"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={status}
            onValueChange={(value) =>
              onStatusChange(value as "ALL" | "ACTIVE" | "INACTIVE")
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="INACTIVE">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={onNewUser}
            className="w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            Novo Usuário
          </Button>
        </div>
      </div>
    </Card>
  );
}
