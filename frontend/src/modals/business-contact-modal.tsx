import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";
import { MessageCircle } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/select";
import { useAccount } from "@/hooks/use-account";
import { handleError } from "@/network/error";
import { useBillingMutations } from "@/network/modules/billing";

type BusinessContactModalProps = {
  closeModal: () => void;
};

enum FormFields {
  Email = "email",
  FirstName = "firstName",
  LastName = "lastName",
  CompanyName = "companyName",
  CompanySize = "companySize",
}

const formSchema = z.object({
  [FormFields.Email]: z.string().email("Invalid email address"),
  [FormFields.FirstName]: z.string().min(1, "First name is required"),
  [FormFields.LastName]: z.string().min(1, "Last name is required"),
  [FormFields.CompanyName]: z.string().min(1, "Company name is required"),
  [FormFields.CompanySize]: z.string().min(1, "Company size is required"),
});

type FormValues = z.infer<typeof formSchema>;

const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000+",
];

export const BusinessContactModal = ({
  closeModal,
}: BusinessContactModalProps) => {
  const {
    user: { email, firstName, lastName },
    defaultWorkspace: {
      workspace: { name },
    },
  } = useAccount();

  const { contactBusinessSales } = useBillingMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.Email]: email,
      [FormFields.FirstName]: firstName,
      [FormFields.LastName]: lastName,
      [FormFields.CompanyName]: name,
      [FormFields.CompanySize]: COMPANY_SIZES[0],
    },
  });

  const {
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await contactBusinessSales.mutateAsync(data);
        closeModal();
        toast.success(
          "Thank you for your interest! Our team will reach out to you within 24 hours.",
        );
      } catch (error) {
        handleError(error);
      }
    },
    [contactBusinessSales, closeModal],
  );

  const isDisabled = useMemo(() => {
    return isSubmitting || !isValid;
  }, [isSubmitting, isValid]);

  return (
    <AlertDialog open onOpenChange={() => closeModal()}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-lg"
        >
          <AlertDialogContent className="sm:max-w-md space-y-6">
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/25">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <AlertDialogTitle className="text-xl text-center">
                We'd love to hear from you!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-muted-foreground">
                Our team is ready to help you find the perfect enterprise
                solution for your organization. Once you submit, our team will
                reach out to you within 24 hours.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name={FormFields.CompanyName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={FormFields.CompanySize}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Sizes</SelectLabel>
                            {COMPANY_SIZES.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <AlertDialogFooter className="flex gap-2">
              <Button
                className="w-full basis-1/2"
                variant="secondary"
                onClick={closeModal}
              >
                Maybe later
              </Button>
              <Button
                disabled={isDisabled}
                loading={isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
                className="w-full basis-1/2"
              >
                Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </form>
      </Form>
    </AlertDialog>
  );
};
