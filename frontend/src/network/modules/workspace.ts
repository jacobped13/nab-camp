
import {
  type AcceptWorkspaceEmailInviteRequestParam,
  type AcceptWorkspaceEmailInviteResponseBody,
  type AssignDefaultWorkspaceRequestBody,
  type AssignDefaultWorkspaceResponseBody,
  type CreateWorkspaceRequestBody,
  type CreateWorkspaceResponseBody,
  type DeclineWorkspaceEmailInviteRequestParam,
  type DeclineWorkspaceEmailInviteResponseBody,
  type FindWorkspaceEmailInviteByCodeRequestParam,
  type FindWorkspaceEmailInviteByCodeResponseBody,
  type RemoveDefaultWorkspaceResponseBody,
  type UpdateWorkspaceRequestBody,
  type UpdateWorkspaceResponseBody,
} from "@shared/api-contracts/workspace";
import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { useAccount } from "@/hooks/use-account";
import { mutate, get } from "@/network/base";
import { QUERY_KEYS } from "@/network/query-keys";

const WORKSPACE_MUTATION_KEYS = {
  CREATE: ["createWorkspace"],
  UPDATE: ["updateWorkspace"],
  ASSIGN_DEFAULT: ["setDefaultWorkspace"],
  REMOVE_DEFAULT: ["removeDefaultWorkspace"],
  ACCEPT_INVITE: ["acceptWorkspaceInvite"],
  DECLINE_INVITE: ["declineWorkspaceInvite"],
};

export const useWorkspaceMutations = () => {
  const {
    defaultWorkspace: {
      workspace: { id: workspaceId },
    },
  } = useAccount();

  const create = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.CREATE,
    mutationFn: (data: CreateWorkspaceRequestBody) =>
      mutate<CreateWorkspaceResponseBody, CreateWorkspaceRequestBody>(
        "/workspace",
        {
          method: "POST",
          payload: data,
        },
      ),
  });

  const update = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.UPDATE,
    mutationFn: (data: UpdateWorkspaceRequestBody) =>
      mutate<UpdateWorkspaceResponseBody, UpdateWorkspaceRequestBody>(
        `/workspace/${workspaceId}`,
        {
          method: "PUT",
          payload: data,
        },
      ),
  });

  const assignDefault = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.ASSIGN_DEFAULT,
    mutationFn: (data: AssignDefaultWorkspaceRequestBody) =>
      mutate<
        AssignDefaultWorkspaceResponseBody,
        AssignDefaultWorkspaceRequestBody
      >("/workspace/default", {
        method: "PUT",
        payload: data,
      }),
  });

  const removeDefault = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.REMOVE_DEFAULT,
    mutationFn: () =>
      mutate<RemoveDefaultWorkspaceResponseBody, void>("/workspace/default", {
        method: "DELETE",
      }),
  });
  const acceptInvite = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.ACCEPT_INVITE,
    mutationFn: ({ id }: AcceptWorkspaceEmailInviteRequestParam) =>
      mutate<AcceptWorkspaceEmailInviteResponseBody, string>(
        `/workspace/invite/email/${id}/accept`,
        {
          method: "POST",
        },
      ),
  });

  const declineInvite = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.DECLINE_INVITE,
    mutationFn: ({ id }: DeclineWorkspaceEmailInviteRequestParam) =>
      mutate<DeclineWorkspaceEmailInviteResponseBody, string>(
        `/workspace/invite/email/${id}/decline`,
        {
          method: "POST",
        },
      ),
  });

  return {
    create,
    update,
    assignDefault,
    removeDefault,
    acceptInvite,
    declineInvite,
  };
};



export const useInvitedWorkspaceDetails = ({
  code,
}: FindWorkspaceEmailInviteByCodeRequestParam) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INVITED_WOKSPACE, code],
    queryFn: () =>
      get<FindWorkspaceEmailInviteByCodeResponseBody>(
        `/workspace/invite/email/code/${code}`,
      ),
  });
};
