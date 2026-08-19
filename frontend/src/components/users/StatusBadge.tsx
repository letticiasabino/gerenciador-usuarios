import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "ACTIVE" | "INACTIVE";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const active = status === "ACTIVE";

  return (
    <Badge variant={active ? "green" : "red"} className="gap-1.5 px-2.5 py-1">
      <span
        className={`h-1.5 w-1.5 rounded-full bg-current ${active ? "" : "opacity-70"}`}
      />
      {active ? "Ativo" : "Inativo"}
    </Badge>
  );
}
