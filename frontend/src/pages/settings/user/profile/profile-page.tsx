import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
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
import { handleError } from "@/network/error";
import { useUserMutations } from "@/network/modules/user";

enum FormFields {
  Firstname = "firstname",
  Lastname = "lastname",
  Email = "email",
}

const formSchema = z.object({
  [FormFields.Firstname]: z.string().min(1, {
    message: "Must be a valid firstname",
  }),
  [FormFields.Lastname]: z.string().min(1, {
    message: "Must be a valid lastname.",
  }),
  [FormFields.Email]: z.string().email({
    message: "Must be a valid email.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const ProfilePage = () => {
  const { user, refresh } = useAccount();
  const { update } = useUserMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.Firstname]: user.firstName,
      [FormFields.Lastname]: user.lastName,
      [FormFields.Email]: user.email,
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: FormValues) => {
    try {
      await update.mutateAsync({
        id: user.id,
        firstName: data.firstname,
        lastName: data.lastname,
      });

      await refresh();
      toast.success("Successfully updated user profile.");
      form.reset(data);
    } catch (error) {
      handleError(error);
    }
  };

  const isDisabled = useMemo(() => {
    return !isDirty || isSubmitting || !isValid;
  }, [isDirty, isSubmitting, isValid]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-lg"
      >
        <FormField
          control={form.control}
          name={FormFields.Firstname}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={FormFields.Lastname}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={FormFields.Email}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled placeholder="Email" {...field} />
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
          Save
        </Button>
      </form>
    </Form>
  );
};
