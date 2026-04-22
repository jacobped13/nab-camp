import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ThemeOptions } from "@/app/providers/theme-provider/consts";
import { useTheme } from "@/app/providers/theme-provider/theme-provider";
import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";

enum FormFields {
  Theme = "theme",
}

const formSchema = z.object({
  [FormFields.Theme]: z.enum([
    ThemeOptions.Light,
    ThemeOptions.Dark,
    ThemeOptions.System,
  ]),
});

type FormValues = z.infer<typeof formSchema>;

export const PreferencesPage = () => {
  const { theme, setTheme } = useTheme();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.Theme]: theme,
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: FormValues) => {
    try {
      setTheme(data.theme);
      toast.success("Successfully updated user preferences.");
      form.reset(data);
    } catch {
      toast.error("Error updating profile. Please try again later.");
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
          name={FormFields.Theme}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ThemeOptions.Light}>Light</SelectItem>
                  <SelectItem value={ThemeOptions.Dark}>Dark</SelectItem>
                  <SelectItem value={ThemeOptions.System}>System</SelectItem>
                </SelectContent>
              </Select>
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
