import { type NavigateArgs } from "@/hooks/use-navigate";

export type GuardResult = {
  loading: boolean;
  redirect?: NavigateArgs;
};

export type GuardConfig = {
  name: string;
  check: () => GuardResult;
  priority: number;
};

export enum GUARD_NAMES {
  // Authentication
  LoggedIn = "loggedIn",
  LoggedOut = "loggedOut",

  // Data loading
  AuthLoaded = "authLoaded",
  AccountLoaded = "accountLoaded",
  FeatureFlagsLoaded = "featureFlagsLoaded",

  // Business logic
  AcceptInvite = "acceptInvite",
  Inactive = "inactive",
  Registered = "registered",
  Active = "active",
  Identified = "identified",
}
