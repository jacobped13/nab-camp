import { useCallback } from "react";

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
import { cn } from "@/lib/utils/classname";
import { handleBulkError, handleError } from "@/network/error";
import { useWorkspaceMutations } from "@/network/modules/workspace";

type DeleteUserModalProps = {
  ids: string[];
  names: string[];
  onComplete: () => void;
  closeModal: () => void;
};

export const DeleteUsersModal = ({
  ids,
  names,
  onComplete,
  closeModal,
}: DeleteUserModalProps) => {
  const { removeWorkspaceMembers } = useWorkspaceMutations();

  const handleDeleteUser = useCallback(async () => {
    try {
      const response = await removeWorkspaceMembers.mutateAsync({
        memberIds: ids,
      });
      handleBulkError({
        errors: response.errors,
      });
      onComplete();
      closeModal();
    } catch (error) {
      handleError(error);
    }
  }, [ids, removeWorkspaceMembers, onComplete, closeModal]);

  return (
    <AlertDialog open onOpenChange={() => closeModal()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to remove the following users? This action cannot be
            undone.
          </AlertDialogDescription>
          <div className="text-muted-foreground text-sm">
            <ul className="mt-2 list-disc pl-5">
              {names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteUser}
            className={cn(
              buttonVariants({ variant: "destructive", size: "sm" }),
            )}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
