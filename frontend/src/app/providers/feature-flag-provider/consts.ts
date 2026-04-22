import { type LDFlagSet, type LDOptions } from "launchdarkly-react-client-sdk";

export type FeatureFlagContextType = {
  _loading: boolean;
  _isAnonymous: boolean;
  flags: LDFlagSet;
};

export type FeatureFlagBaseIdentificationData = {
  kind: string;
  anonymous: boolean;
  key: string;
};

export type FeatureFlagIdentification = FeatureFlagBaseIdentificationData & {
  email: string;
  firstName: string;
  lastName: string;
  workspaceId: string;
};

export const LD_KEYS = {
  ANONYMOUS: "anonymous",
};

export const ANONYMOUS_LD_CONTEXT: FeatureFlagBaseIdentificationData = {
  kind: "user",
  anonymous: true,
  key: LD_KEYS.ANONYMOUS,
};

export const LD_CLIENT_OPTIONS: LDOptions = {
  eventCapacity: 200,
  sendEventsOnlyForVariation: true,
};
