import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils";

interface UserAvatarProps {
  user: {
    fullName?: string;
    name?: string;
    email?: string;
  };
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const displayName = user.fullName || user.name || "Usuário";
  const seed = user.email || displayName;

  return (
    <Avatar className={className}>
      <AvatarImage
        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
        alt={displayName}
      />
      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
    </Avatar>
  );
}
