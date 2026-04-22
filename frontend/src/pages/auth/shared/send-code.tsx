import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Routes } from "@/app/routes/routes";
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
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@/hooks/use-navigate";
import { SearchParamsKeys } from "@/hooks/use-search-params";
import { handleError } from "@/network/error";

enum FormFields {
  Email = "email",
}

const formSchema = z.object({
  [FormFields.Email]: z.string().email({
    message: "Must be a valid email.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const SendCode = () => {
  const navigate = useNavigate();
  const { sendEmailCode } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.Email]: "",
    },
  });

  const onSubmit = useCallback(
    async ({ email }: FormValues) => {
      try {
        const data = await sendEmailCode(email);

        const withoutCodeParams = {
          [SearchParamsKeys.Email]: email,
        };

        const withCodeParams = {
          ...withoutCodeParams,
          [SearchParamsKeys.Code]: data?.code,
        };

        const sendWithCode = Boolean(data?.code) && import.meta.env.DEV;

        navigate({
          route: Routes.AuthVerifyCode,
          newParams: sendWithCode ? withCodeParams : withoutCodeParams,
        });
      } catch (error) {
        handleError(error);
      }
    },
    [sendEmailCode, navigate],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name={FormFields.Email}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  data-testid={DATA_TEST_IDS.AUTH.EMAIL_INPUT}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button
            className="w-full"
            size="sm"
            type="submit"
            loading={form.formState.isSubmitting}
            data-testid={DATA_TEST_IDS.AUTH.EMAIL_SUBMIT_BUTTON}
          >
            Continue with Email
          </Button>
        </div>
      </form>
    </Form>
  );
};
