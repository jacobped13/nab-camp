import {
  type UpdateWorkspaceMemberRolesRequestData,
  WORKSPACE_MEMBER_ROLE,
} from "@shared/api-contracts/workspace";
import { useCallback, useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/alert-dialog";
import { buttonVariants } from "@/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/select";
import { cn } from "@/lib/utils/classname";
import { handleBulkError, handleError } from "@/network/error";
import { useWorkspaceMutations } from "@/network/modules/workspace";

export type Members = (UpdateWorkspaceMemberRolesRequestData & {
  name: string;
})[];

type ChangeUserRoleModalProps = {
  members: Members;
  onComplete: () => void;
  closeModal: () => void;
};

export const ChangeUserRoleModal = ({
  members,
  onComplete,
  closeModal,
}: ChangeUserRoleModalProps) => {
  const { changeWorkspaceMemberRoles } = useWorkspaceMutations();

  const roles = useMemo(() => {
    return members.map((member) => member.role);
  }, [members]);

  const [newRole, setNewRole] = useState<WORKSPACE_MEMBER_ROLE>(() => {
    return roles.length > 1 ? WORKSPACE_MEMBER_ROLE.WORKSPACE_MEMBER : roles[0];
  });

  const handleChangeUserRole = useCallback(async () => {
    try {
      const newRoles = members.map((member) => ({
        id: member.id,
        role: newRole,
      }));

      const response = await changeWorkspaceMemberRoles.mutateAsync({
        members: newRoles,
      });
      handleBulkError({
        errors: response.errors,
      });
      onComplete();
      closeModal();
    } catch (error) {
      handleError(error);
    }
  }, [onComplete, closeModal, changeWorkspaceMemberRoles, members, newRole]);

  const dropdownItems = useMemo(() => {
    return [
      {
        value: WORKSPACE_MEMBER_ROLE.WORKSPACE_ADMIN,
        text: "Admin",
      },
      {
        value: WORKSPACE_MEMBER_ROLE.WORKSPACE_MEMBER,
        text: "Member",
      },
    ];
  }, []);

  const { text } = useMemo(() => {
    return dropdownItems.find((item) => item.value === newRole)!;
  }, [newRole, dropdownItems]);

  return (
    <AlertDialog open onOpenChange={() => closeModal()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change user role</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new role for the following users:
          </AlertDialogDescription>
          <div className="text-muted-foreground text-sm">
            <ul className="mt-2 list-disc pl-5">
              {members.map(({ name }) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </AlertDialogHeader>
        <Select
          value={newRole}
          onValueChange={(value) => setNewRole(value as WORKSPACE_MEMBER_ROLE)}
        >
          <SelectTrigger className="w-full">{text}</SelectTrigger>
          <SelectContent>
            {dropdownItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleChangeUserRole}
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
