import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
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
import { DATA_TEST_IDS } from "@/e2e/consts";
import { useAccount } from "@/hooks/use-account";
import { handleError } from "@/network/error";
import { useWorkspaceMutations } from "@/network/modules/workspace";
import { OnboardingPage } from "@/pages/account/shared/onboarding-page";

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

export const WorkspaceRegistration = () => {
  const { refresh } = useAccount();
  const { create } = useWorkspaceMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.Name]: "",
      [FormFields.URL]: "",
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const onSubmit = async ({ name, url }: FormValues) => {
    try {
      await create.mutateAsync({
        name,
        url,
      });

      await refresh();
    } catch (error) {
      handleError(error);
    }
  };

  const isDisabled = useMemo(() => {
    return !isDirty || isSubmitting || !isValid;
  }, [isDirty, isSubmitting, isValid]);

  return (
    <OnboardingPage
      title="Registration"
      header="What's your workspace called?"
      loading={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-md space-y-6">
          <FormField
            control={form.control}
            name={FormFields.Name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workspace name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My awesome workspace"
                    data-testid={
                      DATA_TEST_IDS.REGISTRATION.WORKSPACE.NAME_INPUT
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={FormFields.URL}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://www.yourcompany.com"
                    data-testid={DATA_TEST_IDS.REGISTRATION.WORKSPACE.URL_INPUT}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              type="submit"
              disabled={isDisabled}
              loading={isSubmitting}
              data-testid={DATA_TEST_IDS.REGISTRATION.WORKSPACE.SUBMIT_BUTTON}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </OnboardingPage>
  );
};
