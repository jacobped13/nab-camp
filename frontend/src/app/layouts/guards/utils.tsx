import { type GuardConfig } from "@/app/layouts/guards/types";

export const sortGuardsByPriority = (guards: GuardConfig[]): GuardConfig[] => {
  return guards.toSorted((a, b) => a.priority - b.priority);
};
