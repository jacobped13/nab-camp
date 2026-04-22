import { useMemo } from "react";

import { Badge } from "@/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { useAccount } from "@/hooks/use-account";
import { centsToDollars } from "@/lib/utils/currency";
import { PLAN_FREQUENCY_LABELS } from "@/pages/account/shared/plan-cards";

export const CurrentPlanCard = () => {
  const {
    defaultWorkspace: {
      subscription: {
        currentPeriodEndAt,
        cancelAt,
        plan: { name: planName, amount: planAmount, frequency },
      },
    },
  } = useAccount();

  const { badgeText, badgeColor, dateTextHeader, dateTextValue } =
    useMemo(() => {
      if (cancelAt) {
        return {
          badgeText: "Cancelled",
          badgeColor: "bg-red-500 text-white",
          dateTextHeader: "Last day of access",
          dateTextValue: new Date(cancelAt).toLocaleDateString(),
        };
      }

      return {
        badgeText: "Active",
        badgeColor: "bg-green-500 text-white",
        dateTextHeader: "Next billing date",
        dateTextValue: new Date(currentPeriodEndAt).toLocaleDateString(),
      };
    }, [cancelAt, currentPeriodEndAt]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>Your subscription details and usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold flex items-center gap-4">
                {planName} <Badge className={badgeColor}>{badgeText}</Badge>
              </h3>
            </div>
            <p className="text-muted-foreground">
              {centsToDollars(planAmount)} / {PLAN_FREQUENCY_LABELS[frequency]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">{dateTextHeader}</p>
            <p className="font-medium flex justify-end text-muted-foreground">
              {dateTextValue}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
