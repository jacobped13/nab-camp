import { useAcceptInviteGuard } from "@/app/layouts/guards/hooks/use-accept-invite-guard";
import { useAccountLoadedGuard } from "@/app/layouts/guards/hooks/use-account-loaded-guard";
import { useActiveGuard } from "@/app/layouts/guards/hooks/use-active-guard";
import { useFeatureFlagsLoadedGuard } from "@/app/layouts/guards/hooks/use-feature-flags-loaded-guard";
import { useIdentifiedGuard } from "@/app/layouts/guards/hooks/use-identified-guard";
import { useInactiveGuard } from "@/app/layouts/guards/hooks/use-inactive-guard";
import { useLoggedInGuard } from "@/app/layouts/guards/hooks/use-logged-in-guard";
import { useLoggedOutGuard } from "@/app/layouts/guards/hooks/use-logged-out-guard";
import { useRegisteredGuard } from "@/app/layouts/guards/hooks/use-registered-guard";
import { GUARD_NAMES, type GuardConfig } from "@/app/layouts/guards/types";

export const GUARD_PRIORITIES = {
  // Authentication
  [GUARD_NAMES.LoggedIn]: 1,
  [GUARD_NAMES.LoggedOut]: 1,

  // Data loading
  [GUARD_NAMES.AuthLoaded]: 2,
  [GUARD_NAMES.AccountLoaded]: 3,
  [GUARD_NAMES.FeatureFlagsLoaded]: 4,

  // Business logic
  [GUARD_NAMES.AcceptInvite]: 5,
  [GUARD_NAMES.Registered]: 6,
  [GUARD_NAMES.Inactive]: 7,
  [GUARD_NAMES.Active]: 8,
  [GUARD_NAMES.Identified]: 9,
};

export const guardChecks = {
  [GUARD_NAMES.LoggedIn]: (): GuardConfig => ({
    name: GUARD_NAMES.LoggedIn,
    priority: GUARD_PRIORITIES[GUARD_NAMES.LoggedIn],
    check: useLoggedInGuard,
  }),

  [GUARD_NAMES.LoggedOut]: (): GuardConfig => ({
    name: GUARD_NAMES.LoggedOut,
    priority: GUARD_PRIORITIES[GUARD_NAMES.LoggedOut],
    check: useLoggedOutGuard,
  }),

  [GUARD_NAMES.AcceptInvite]: (): GuardConfig => ({
    name: GUARD_NAMES.AcceptInvite,
    priority: GUARD_PRIORITIES[GUARD_NAMES.AcceptInvite],
    check: useAcceptInviteGuard,
  }),

  [GUARD_NAMES.Registered]: (): GuardConfig => ({
    name: GUARD_NAMES.Registered,
    priority: GUARD_PRIORITIES[GUARD_NAMES.Registered],
    check: useRegisteredGuard,
  }),

  [GUARD_NAMES.Inactive]: (): GuardConfig => ({
    name: GUARD_NAMES.Inactive,
    priority: GUARD_PRIORITIES[GUARD_NAMES.Inactive],
    check: useInactiveGuard,
  }),

  [GUARD_NAMES.Active]: (): GuardConfig => ({
    name: GUARD_NAMES.Active,
    priority: GUARD_PRIORITIES[GUARD_NAMES.Active],
    check: useActiveGuard,
  }),

  [GUARD_NAMES.Identified]: (): GuardConfig => ({
    name: GUARD_NAMES.Identified,
    priority: GUARD_PRIORITIES[GUARD_NAMES.Identified],
    check: useIdentifiedGuard,
  }),

  [GUARD_NAMES.AccountLoaded]: (): GuardConfig => ({
    name: GUARD_NAMES.AccountLoaded,
    priority: GUARD_PRIORITIES[GUARD_NAMES.AccountLoaded],
    check: useAccountLoadedGuard,
  }),

  [GUARD_NAMES.FeatureFlagsLoaded]: (): GuardConfig => ({
    name: GUARD_NAMES.FeatureFlagsLoaded,
    priority: GUARD_PRIORITIES[GUARD_NAMES.FeatureFlagsLoaded],
    check: useFeatureFlagsLoadedGuard,
  }),
};

export const guardConfigurations = {
  authenticatedApp: (): GuardConfig[] => [
    guardChecks.loggedIn(),
    guardChecks.acceptInvite(),
    guardChecks.registered(),
    guardChecks.inactive(),
    guardChecks.identified(),
  ],

  unauthenticatedApp: (): GuardConfig[] => [
    guardChecks.loggedOut(),
    guardChecks.featureFlagsLoaded(),
  ],

  inactiveAccountFlow: (): GuardConfig[] => [
    guardChecks.loggedIn(),
    guardChecks.active(),
    guardChecks.acceptInvite(),
    guardChecks.registered(),
    guardChecks.identified(),
  ],

  acceptInviteFlow: (): GuardConfig[] => [
    guardChecks.loggedIn(),
    guardChecks.featureFlagsLoaded(),
  ],

  registrationFlow: (): GuardConfig[] => [
    guardChecks.loggedIn(),
    guardChecks.active(),
    guardChecks.acceptInvite(),
    guardChecks.featureFlagsLoaded(),
  ],
};
