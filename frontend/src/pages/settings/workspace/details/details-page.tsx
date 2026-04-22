import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import { useAccount } from "@/hooks/use-account";
import { useAuthorization } from "@/hooks/use-authorization";
import { handleError } from "@/network/error";
import { useWorkspaceMutations } from "@/network/modules/workspace";

enum FormFields {
  Name = "name",
  URL = "url",
}

const formSchema = z.object({
  [FormFields.Name]: z.string().min(1, {
    message: "Must be a valid name",
  }),
  [FormFields.URL]: z.string().url({
    message: "Must be a valid URL.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const DetailsPage = () => {
  const { defaultWorkspace, refresh } = useAccount();
  const {
    workspaceFeatures: { editWorkspace },
  } = useAuthorization();
  const { update } = useWorkspaceMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.Name]: defaultWorkspace.workspace.name || "",
      [FormFields.URL]: defaultWorkspace.workspace.url || "",
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await update.mutateAsync(data);
        await refresh();
        toast.success("Successfully updated workspace details.");
        form.reset(data);
      } catch (error) {
        handleError(error);
      }
    },
    [update, refresh, form],
  );

  const isDisabled = useMemo(() => {
    return !isDirty || isSubmitting || !isValid || !editWorkspace.allowed;
  }, [isDirty, isSubmitting, isValid, editWorkspace]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg"
      >
        <FormField
          control={form.control}
          name={FormFields.Name}
          disabled={!editWorkspace.allowed}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={FormFields.URL}
          disabled={!editWorkspace.allowed}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size="sm"
          type="submit"
          disabled={isDisabled}
          loading={isSubmitting}
        >
          Next
        </Button>
      </form>
    </Form>
  );
};
