import { type MappedAccountContext } from "@/app/providers/account-provider/consts";
import { type FeatureFlagIdentification } from "@/app/providers/feature-flag-provider/consts";

export const mapAccountToLDIdentificationData = (
  accountData: MappedAccountContext,
): FeatureFlagIdentification => {
  return {
    kind: "user",
    anonymous: false,
    key: accountData.user.id,
    email: accountData.user.email,
    firstName: accountData.user.firstName,
    lastName: accountData.user.lastName,
    workspaceId: accountData.defaultWorkspace.workspace.id,
  };
};
