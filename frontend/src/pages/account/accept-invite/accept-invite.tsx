import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Routes } from "@/app/routes/routes";
import { Button } from "@/components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { DATA_TEST_IDS } from "@/e2e/consts";
import { useAccount } from "@/hooks/use-account";
import { useNavigate } from "@/hooks/use-navigate";
import { SearchParamsKeys } from "@/hooks/use-search-params";
import { handleError } from "@/network/error";
import { useWorkspaceMutations } from "@/network/modules/workspace";

type AcceptInviteProps = {
  inviteId: string;
  workspaceName: string;
};

export const AcceptInvite = ({
  inviteId,
  workspaceName,
}: AcceptInviteProps) => {
  const navigate = useNavigate();
  const { refresh } = useAccount();
  const { acceptInvite, declineInvite } = useWorkspaceMutations();

  const [declineSubmitting, setDeclineSubmitting] = useState<boolean>(false);
  const [acceptSubmitting, setAcceptSubmitting] = useState<boolean>(false);

  const handleDeclineInvite = useCallback(async () => {
    try {
      setDeclineSubmitting(true);
      await declineInvite.mutateAsync({ id: inviteId });
      await refresh();
      toast.success("You have declined the invite.");
      navigate({
        route: Routes.Home,
        clearParams: [SearchParamsKeys.InviteId],
      });
    } catch (error) {
      handleError(error);
    } finally {
      setDeclineSubmitting(false);
    }
  }, [declineInvite, inviteId, refresh, navigate]);

  const handleAcceptInvite = useCallback(async () => {
    try {
      setAcceptSubmitting(true);
      await acceptInvite.mutateAsync({ id: inviteId });
      await refresh();
      toast.success("You have joined the workspace!");
      navigate({
        route: Routes.Home,
        clearParams: [SearchParamsKeys.InviteId],
      });
    } catch (error) {
      handleError(error);
    } finally {
      setAcceptSubmitting(false);
    }
  }, [acceptInvite, inviteId, refresh, navigate]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{workspaceName}</CardTitle>
          <CardDescription>
            You have been invited to join this workspace.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex gap-4">
        <Button
          variant="secondary"
          className="w-full"
          loading={declineSubmitting}
          disabled={acceptSubmitting}
          onClick={handleDeclineInvite}
          data-testid={DATA_TEST_IDS.INVITE.DECLINE_BUTTON}
        >
          Decline invite
        </Button>
        <Button
          loading={acceptSubmitting}
          disabled={declineSubmitting}
          className="w-full"
          onClick={handleAcceptInvite}
          data-testid={DATA_TEST_IDS.INVITE.ACCEPT_BUTTON}
        >
          Join workspace
        </Button>
      </div>
    </div>
  );
};
