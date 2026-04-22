import { zodResolver } from "@hookform/resolvers/zod";
import {
  BILLING_FREQUENCY,
  type SubscriptionPlan,
} from "@shared/api-contracts/billing";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { DATA_TEST_IDS } from "@/e2e/consts";
import {
  PLAN_FREQUENCY_LABELS,
  PlanCards,
  PlanCardsVariants,
} from "@/pages/account/shared/plan-cards";

enum FormFields {
  PlanId = "planId",
}

const formSchema = z.object({
  [FormFields.PlanId]: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type PlanRegistrationProps = {
  plans: SubscriptionPlan[];
  handleSelectPlan: (planId: string) => void;
};

export const PlanRegistration = ({
  plans,
  handleSelectPlan,
}: PlanRegistrationProps) => {
  const [activeFrequency, setActiveFrequency] = useState<BILLING_FREQUENCY>(
    BILLING_FREQUENCY.MONTHLY,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      [FormFields.PlanId]: plans[0].id,
    },
  });

  const activePlan = form.watch(FormFields.PlanId);

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = useCallback(
    async ({ planId }: FormValues) => {
      handleSelectPlan(planId);
    },
    [handleSelectPlan],
  );

  const isDisabled = useMemo(() => {
    return isSubmitting || !isValid;
  }, [isSubmitting, isValid]);

  const displayedPlans = useMemo(
    () =>
      plans
        .filter((plan) => plan.frequency === activeFrequency)
        .map((plan) => ({
          ...plan,
          variant:
            activePlan === plan.id
              ? PlanCardsVariants.SELECTED
              : PlanCardsVariants.SELECTABLE,
        })),
    [plans, activePlan, activeFrequency],
  );

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-4xl mx-auto space-y-6"
        >
          <Tabs value={activeFrequency}>
            <TabsList className="flex gap-2">
              {Object.entries(PLAN_FREQUENCY_LABELS).map(
                ([frequency, label]) => (
                  <TabsTrigger
                    key={frequency}
                    onClick={() =>
                      setActiveFrequency(frequency as BILLING_FREQUENCY)
                    }
                    value={frequency}
                  >
                    {label}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>
          <PlanCards
            plans={displayedPlans}
            onSelectPlan={(plan: SubscriptionPlan) =>
              form.setValue(FormFields.PlanId, plan.id)
            }
          />
          <div className="flex justify-end">
            <Button
              disabled={isDisabled}
              loading={isSubmitting}
              type="submit"
              size="sm"
              data-testid={DATA_TEST_IDS.REGISTRATION.PLAN.SUBMIT_BUTTON}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
