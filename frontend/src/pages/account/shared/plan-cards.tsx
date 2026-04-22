import {
  BILLING_FREQUENCY,
  SUBSCRIPTION_PLAN_SETUP_TYPE,
  type SubscriptionPlan,
} from "@shared/api-contracts/billing";
import { CheckIcon } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { DATA_TEST_IDS } from "@/e2e/consts";
import { useModalContext } from "@/hooks/use-modal";
import { cn } from "@/lib/utils/classname";
import { centsToDollars } from "@/lib/utils/currency";
import { BusinessContactModal } from "@/modals/business-contact-modal";

export const PLAN_FREQUENCY_LABELS: Record<BILLING_FREQUENCY, string> = {
  [BILLING_FREQUENCY.MONTHLY]: "Monthly",
  [BILLING_FREQUENCY.YEARLY]: "Yearly",
};

export enum PlanCardsVariants {
  SELECTABLE = "selectable",
  SELECTED = "selected",
  DOWNGRADEABLE = "downgradeable",
  UPGRADEABLE = "upgradeable",
}

type ExtendedSubscriptionPlan = SubscriptionPlan & {
  variant: PlanCardsVariants;
};

type PlanCardProps = {
  plans: ExtendedSubscriptionPlan[];
  onSelectPlan: (plan: ExtendedSubscriptionPlan) => void;
};

const VARIANT_CONFIG = {
  [PlanCardsVariants.SELECTABLE]: {
    showFooterAction: (plan: ExtendedSubscriptionPlan) =>
      plan.setupType === SUBSCRIPTION_PLAN_SETUP_TYPE.MANUAL,
    getCtaText: (plan: ExtendedSubscriptionPlan) => `Select ${plan.name}`,
    enableCardClick: true,
    getCardClasses: (isSelectable: boolean) =>
      isSelectable
        ? "cursor-pointer hover:shadow-md transition-all duration-200 ease-linear"
        : "",
  },
  [PlanCardsVariants.SELECTED]: {
    showFooterAction: () => false,
    getCtaText: () => "",
    enableCardClick: false,
    getCardClasses: () => "border-primary ring-2 ring-primary/20",
  },
  [PlanCardsVariants.UPGRADEABLE]: {
    showFooterAction: () => true,
    getCtaText: (plan: SubscriptionPlan) => `Upgrade to ${plan.name}`,
    enableCardClick: false,
    getCardClasses: () => "",
  },
  [PlanCardsVariants.DOWNGRADEABLE]: {
    showFooterAction: () => true,
    getCtaText: (plan: SubscriptionPlan) => `Downgrade to ${plan.name}`,
    enableCardClick: false,
    getCardClasses: () => "",
  },
} as const;

const isPlanSelectable = (plan: SubscriptionPlan): boolean =>
  plan.setupType === SUBSCRIPTION_PLAN_SETUP_TYPE.SELF_SERVICE;

const getDisplayPrice = (plan: ExtendedSubscriptionPlan): string | number =>
  isPlanSelectable(plan) ? centsToDollars(plan.amount) : "Custom";

const getFooterCta = (
  plan: ExtendedSubscriptionPlan,
  variant: PlanCardsVariants,
): string => {
  if (isPlanSelectable(plan)) {
    return VARIANT_CONFIG[variant].getCtaText(plan);
  }
  return "Contact us";
};

const getCardClasses = (
  plan: ExtendedSubscriptionPlan,
  variant: PlanCardsVariants,
): string => {
  const baseClasses = "flex flex-col min-h-[280px] h-full";

  const variantClasses = VARIANT_CONFIG[variant].getCardClasses(
    isPlanSelectable(plan),
  );

  return cn(baseClasses, variantClasses);
};

const canHandleCardClick = (
  plan: ExtendedSubscriptionPlan,
  variant: PlanCardsVariants,
): boolean => VARIANT_CONFIG[variant].enableCardClick && isPlanSelectable(plan);

const shouldShowFooterAction = (
  plan: ExtendedSubscriptionPlan,
  variant: PlanCardsVariants,
): boolean => VARIANT_CONFIG[variant].showFooterAction(plan);

export const PlanCards = ({ plans, onSelectPlan }: PlanCardProps) => {
  const { openModal } = useModalContext();
  const handleContactUs = useCallback(() => {
    openModal(BusinessContactModal, {});
  }, [openModal]);

  const handlePlanAction = useCallback(
    (plan: ExtendedSubscriptionPlan) => {
      if (isPlanSelectable(plan)) {
        onSelectPlan(plan);
      } else {
        handleContactUs();
      }
    },
    [onSelectPlan, handleContactUs],
  );

  const handleCardClick = useCallback(
    (plan: ExtendedSubscriptionPlan) => {
      if (canHandleCardClick(plan, plan.variant)) {
        onSelectPlan(plan);
      }
    },
    [onSelectPlan],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            onClick={() => handleCardClick(plan)}
            className={getCardClasses(plan, plan.variant)}
            data-testid={DATA_TEST_IDS.REGISTRATION.PLAN.PLAN_CARD}
          >
            <CardHeader className="text-center pb-2 flex-shrink-0">
              <CardTitle className="flex items-center justify-center gap-4 mb-3 text-lg md:text-xl">
                {plan.name}
              </CardTitle>
              <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-4xl">
                  {getDisplayPrice(plan)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {PLAN_FREQUENCY_LABELS[plan.frequency]}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                {plan.description}
              </p>
              <ul className="space-y-2.5 text-sm flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              {shouldShowFooterAction(plan, plan.variant) && (
                <Button
                  type="button"
                  onClick={() => handlePlanAction(plan)}
                  className="w-full"
                >
                  {getFooterCta(plan, plan.variant)}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
