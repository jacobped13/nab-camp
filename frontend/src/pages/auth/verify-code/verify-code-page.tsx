import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "@/hooks/use-search-params";
import { handleError } from "@/network/error";

enum FormFields {
  Code = "code",
}

const formSchema = z.object({
  [FormFields.Code]: z.string().min(6, {
    message: "Code must be at least 6 characters long.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const VerifyCodePage = () => {
  const {
    values: { email, code },
  } = useSearchParams();
  const { resendEmailCode, acceptEmailCode } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.Code]: code,
    },
  });

  const resendCode = useCallback(async () => {
    await resendEmailCode(email);
  }, [email, resendEmailCode]);

  const onSubmit = useCallback(
    async ({ code }: FormValues) => {
      try {
        await acceptEmailCode(email, code);
      } catch (error) {
        handleError(error);
      }
    },
    [acceptEmailCode, email],
  );

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-thin">Check your email</span>
        <span className="text-sm font-thin">
          Confirm your email address by entering the six-digit code sent to{" "}
          <b>{email}</b>.
        </span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name={FormFields.Code}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 6 digit code"
                    data-testid={DATA_TEST_IDS.AUTH.VERIFY_CODE_INPUT}
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
              data-testid={DATA_TEST_IDS.AUTH.VEFIFY_SUBMIT_BUTTON}
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex items-center">
        <span className="text-sm font-thin">Didn't get the code?</span>
        <Button
          variant="link"
          size="sm"
          onClick={resendCode}
          data-testid={DATA_TEST_IDS.AUTH.RESEND_CODE_BUTTON}
        >
          Resend
        </Button>
      </div>
    </div>
  );
};
