import { WORKSPACE_MEMBER_ROLE } from "@shared/api-contracts/workspace";

import { Badge } from "@/components/badge";
import { useAccount } from "@/hooks/use-account";

type RoleMapping = {
  [key in WORKSPACE_MEMBER_ROLE]: {
    variant: "default" | "secondary";
    className: string;
    text: string;
  };
};

const ROLE_MAPPING: RoleMapping = {
  [WORKSPACE_MEMBER_ROLE.WORKSPACE_ADMIN]: {
    variant: "default",
    className: "bg-blue-700",
    text: "Admin",
  },
  [WORKSPACE_MEMBER_ROLE.WORKSPACE_MEMBER]: {
    variant: "default",
    className: "bg-gray-500",
    text: "Member",
  },
};

type RoleBadgeProps = {
  userId: string;
  role: WORKSPACE_MEMBER_ROLE;
};

export const RoleBadge = ({ userId, role }: RoleBadgeProps) => {
  const {
    defaultWorkspace: {
      owner: { id: ownerId },
    },
  } = useAccount();

  const { variant, className, text } = ROLE_MAPPING[role];

  if (userId === ownerId) {
    return (
      <Badge variant="default" className="bg-green-600">
        Workspace Owner
      </Badge>
    );
  }

  return (
    <Badge variant={variant} className={className}>
      {text}
    </Badge>
  );
};
