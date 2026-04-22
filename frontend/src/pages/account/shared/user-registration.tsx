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
import { useUserMutations } from "@/network/modules/user";
import { OnboardingPage } from "@/pages/account/shared/onboarding-page";

enum FormFields {
  FirstName = "firstName",
  LastName = "lastName",
}

const formSchema = z.object({
  [FormFields.FirstName]: z.string().min(1, {
    message: "Must be a valid firstname",
  }),
  [FormFields.LastName]: z.string().min(1, {
    message: "Must be a valid lastname.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const UserRegistration = () => {
  const { refresh } = useAccount();
  const { create } = useUserMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.FirstName]: "",
      [FormFields.LastName]: "",
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const onSubmit = async ({ firstName, lastName }: FormValues) => {
    try {
      await create.mutateAsync({
        firstName,
        lastName,
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
      header="What should we call you?"
      loading={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-md space-y-6">
          <FormField
            control={form.control}
            name={FormFields.FirstName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your first name"
                    data-testid={
                      DATA_TEST_IDS.REGISTRATION.USER.FIRSTNAME_INPUT
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
            name={FormFields.LastName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your last name"
                    data-testid={DATA_TEST_IDS.REGISTRATION.USER.LASTNAME_INPUT}
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
              data-testid={DATA_TEST_IDS.REGISTRATION.USER.SUBMIT_BUTTON}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </OnboardingPage>
  );
};
