import { type ReactNode } from "react";

import { Redirect } from "@/app/layouts/guards/redirect";
import { type GuardConfig } from "@/app/layouts/guards/types";
import { sortGuardsByPriority } from "@/app/layouts/guards/utils";
import { AppLoader } from "@/components/loader";

export type GuardSystemProps = {
  guards: GuardConfig[];
  children: ReactNode;
};

export const Guard = ({ guards, children }: GuardSystemProps) => {
  const guardResults = guards.map((guard) => ({
    guard,
    result: guard.check(),
  }));

  const orderedGuardResults = sortGuardsByPriority(
    guardResults.map((gr) => gr.guard),
  ).map(
    (sortedGuard) =>
      guardResults.find((gr) => gr.guard.name === sortedGuard.name)!,
  );

  for (const { result } of orderedGuardResults) {
    if (result.loading) return <AppLoader />;

    if (result.redirect) {
      return <Redirect {...result.redirect} />;
    }
  }

  return <>{children}</>;
};
