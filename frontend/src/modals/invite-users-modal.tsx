import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Badge } from "@/components/badge";
import { buttonVariants } from "@/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { DATA_TEST_IDS } from "@/e2e/consts";
import { setInviteCodeKey } from "@/e2e/utils";
import { cn } from "@/lib/utils/classname";
import { handleBulkError, handleError } from "@/network/error";
import { useWorkspaceMutations } from "@/network/modules/workspace";

enum FormFields {
  Emails = "emails",
}

const formSchema = z.object({
  [FormFields.Emails]: z
    .array(z.string().email({ message: "Invalid email address" }))
    .nonempty("At least one email is required"),
});

type FormValues = z.infer<typeof formSchema>;

type InviteUsersModalProps = {
  onComplete: () => void;
  closeModal: () => void;
};

export const InviteUsersModal = ({
  onComplete,
  closeModal,
}: InviteUsersModalProps) => {
  const { sendWorkspaceInvites } = useWorkspaceMutations();

  const [inputValue, setInputValue] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { [FormFields.Emails]: [] },
  });

  const {
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const emails = form.watch(FormFields.Emails);

  const isValidEmail = useCallback((email: string) => {
    return z.string().email().safeParse(email).success;
  }, []);

  const addEmail = useCallback(() => {
    const trimmed = inputValue.trim();

    if (!isValidEmail(trimmed)) {
      form.setError(FormFields.Emails, {
        type: "custom",
        message: "Invalid email",
      });
      return;
    }

    if (emails.includes(trimmed)) {
      form.setError(FormFields.Emails, {
        type: "custom",
        message: "User already invited",
      });
      return;
    }

    form.clearErrors();

    form.setValue(FormFields.Emails, [...emails, trimmed], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setInputValue("");
  }, [inputValue, emails, form, isValidEmail]);

  const removeEmail = useCallback(
    (emailToRemove: string) => {
      const newEmails = emails.filter((email) => email !== emailToRemove);
      form.setValue(FormFields.Emails, newEmails as [string, ...string[]], {
        shouldValidate: true,
      });
    },
    [form, emails],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ([",", " "].includes(e.key)) {
        e.preventDefault();
        addEmail();
      }
    },
    [addEmail],
  );

  const onSubmit = useCallback(
    async ({ emails }: FormValues) => {
      try {
        const response = await sendWorkspaceInvites.mutateAsync({
          emails,
        });
        setInviteCodeKey(response.data?.[0]?.code);
        if (response.data)
          handleBulkError({
            errors: response.errors,
          });
        closeModal();
        onComplete();
      } catch (error) {
        handleError(error);
      }
    },
    [onComplete, closeModal, sendWorkspaceInvites],
  );

  const isDisabled = useMemo(() => {
    return !isDirty || isSubmitting || !isValid;
  }, [isDirty, isSubmitting, isValid]);

  return (
    <AlertDialog open onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invite users</AlertDialogTitle>
          <AlertDialogDescription>
            Enter one or more email addresses. Press <kbd>Comma</kbd> or{" "}
            <kbd>Space</kbd> to add.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="emails"
              render={() => (
                <FormItem>
                  <FormLabel>Emails</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      data-testid={DATA_TEST_IDS.INVITE.SEND_INVITES_INPUT}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="my-4 flex flex-wrap gap-2">
              {emails.map((email) => (
                <Badge
                  key={email}
                  className="pr-1 pl-3 py-1 flex items-center gap-1"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className=""
                  >
                    <X className="h-3 w-3 cursor-pointer" />
                  </button>
                </Badge>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                )}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={isDisabled}
                onClick={form.handleSubmit(onSubmit)}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                )}
                data-testid={DATA_TEST_IDS.INVITE.SEND_INVITES_BUTTON}
              >
                Invite
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
