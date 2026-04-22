import { useMemo } from "react";

import { Routes } from "@/app/routes/routes";
import { Button } from "@/components/button";
import { useAccount } from "@/hooks/use-account";
import { useNavigate } from "@/hooks/use-navigate";
import { SearchParamsKeys, useSearchParams } from "@/hooks/use-search-params";
import { useInvitedWorkspaceDetails } from "@/network/modules/workspace";
import { AcceptInvite } from "@/pages/account/accept-invite/accept-invite";
import { OnboardingPage } from "@/pages/account/shared/onboarding-page";
import { UserRegistration } from "@/pages/account/shared/user-registration";

export enum INVITATION_STATES {
  CREATE_USER = "create_user",
  ACCEPT_INVITE = "accept_invite",
}
export const AcceptInviteInitializer = () => {
  const {
    values: { inviteId: paramInviteId },
  } = useSearchParams();
  const navigate = useNavigate();

  const { isLoading, data, error } = useInvitedWorkspaceDetails({
    code: paramInviteId,
  });

  const { user } = useAccount();

  const invitationState = useMemo(() => {
    if (!user.id) {
      return INVITATION_STATES.CREATE_USER;
    }
    return INVITATION_STATES.ACCEPT_INVITE;
  }, [user.id]);

  const { inviteId, workspaceName } = useMemo(() => {
    return {
      inviteId: data?.invite?.id ?? "",
      workspaceName: data?.metadata?.workspaceName ?? "",
    };
  }, [data]);

  if (invitationState === INVITATION_STATES.CREATE_USER) {
    return <UserRegistration />;
  }

  if (error) {
    return (
      <OnboardingPage
        title="Invite Error"
        header="Invite is invalid or expired"
        loading={isLoading}
      >
        <div className="flex flex-col justify-start gap-4">
          <p>
            The invite link you used is either invalid or has expired. Please
            contact the workspace administrator for a new invite.
          </p>
          <div>
            <Button
              variant="outline"
              onClick={() =>
                navigate({
                  route: Routes.Home,
                  clearParams: [SearchParamsKeys.InviteId],
                })
              }
            >
              Back to Home
            </Button>
          </div>
        </div>
      </OnboardingPage>
    );
  }

  return (
    <OnboardingPage
      title="Accept Invite"
      header="Do you want to join this workspace?"
      loading={isLoading}
    >
      {invitationState === INVITATION_STATES.ACCEPT_INVITE && (
        <AcceptInvite inviteId={inviteId} workspaceName={workspaceName} />
      )}
    </OnboardingPage>
  );
};
