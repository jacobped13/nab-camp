import {
  PAGINATION_DIRECTION,
  SORT_DIRECTION,
} from "@shared/api-contracts/common";
import {
  type AcceptWorkspaceEmailInviteRequestParam,
  type AcceptWorkspaceEmailInviteResponseBody,
  type AssignDefaultWorkspaceRequestBody,
  type AssignDefaultWorkspaceResponseBody,
  type CreateWorkspaceRequestBody,
  type CreateWorkspaceResponseBody,
  type DeclineWorkspaceEmailInviteRequestParam,
  type DeclineWorkspaceEmailInviteResponseBody,
  type ExpireWorkspaceEmailInvitesRequestBody,
  type ExpireWorkspaceEmailInvitesResponseBody,
  type FindWorkspaceEmailInviteByCodeRequestParam,
  type FindWorkspaceEmailInviteByCodeResponseBody,
  type FindWorkspaceEmailInvitesResponseBody,
  type FindWorkspaceMembersResponseBody,
  type RemoveDefaultWorkspaceResponseBody,
  type RemoveWorkspaceMembersRequestBody,
  type RemoveWorkspaceMembersResponseBody,
  type SendWorkspaceEmailInvitesRequestBody,
  type SendWorkspaceEmailInvitesResponseBody,
  type UpdateWorkspaceMemberRolesRequestBody,
  type UpdateWorkspaceMemberRolesResponseBody,
  type UpdateWorkspaceRequestBody,
  type UpdateWorkspaceResponseBody,
  WORKSPACE_EMAIL_INVITE_SORT_FIELD,
  WORKSPACE_MEMBER_SORT_FIELD,
} from "@shared/api-contracts/workspace";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { useMemo } from "react";

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
  SEND_INVITES: ["sendWorkspaceInvites"],
  EXPIRE_INVITES: ["expireWorkspaceInvites"],
  REMOVE_MEMBERS: ["removeWorkspaceMembers"],
  CHANGE_ROLES: ["changeWorkspaceMembersRole"],
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

  const sendWorkspaceInvites = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.SEND_INVITES,
    mutationFn: ({ emails }: SendWorkspaceEmailInvitesRequestBody) =>
      mutate<
        SendWorkspaceEmailInvitesResponseBody,
        SendWorkspaceEmailInvitesRequestBody
      >(`/workspace/${workspaceId}/invite/email/send`, {
        method: "POST",
        payload: { emails },
      }),
  });

  const expireWorkspaceInvites = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.EXPIRE_INVITES,
    mutationFn: ({ inviteIds }: ExpireWorkspaceEmailInvitesRequestBody) =>
      mutate<
        ExpireWorkspaceEmailInvitesResponseBody,
        ExpireWorkspaceEmailInvitesRequestBody
      >(`/workspace/${workspaceId}/invite/email/expire`, {
        method: "POST",
        payload: { inviteIds },
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

  const removeWorkspaceMembers = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.REMOVE_MEMBERS,
    mutationFn: ({ memberIds }: RemoveWorkspaceMembersRequestBody) =>
      mutate<
        RemoveWorkspaceMembersResponseBody,
        RemoveWorkspaceMembersRequestBody
      >(`/workspace/${workspaceId}/member/remove`, {
        payload: { memberIds },
        method: "DELETE",
      }),
  });

  const changeWorkspaceMemberRoles = useMutation({
    mutationKey: WORKSPACE_MUTATION_KEYS.CHANGE_ROLES,
    mutationFn: ({ members }: UpdateWorkspaceMemberRolesRequestBody) =>
      mutate<
        UpdateWorkspaceMemberRolesResponseBody,
        UpdateWorkspaceMemberRolesRequestBody
      >(`/workspace/${workspaceId}/member/role`, {
        payload: { members },
        method: "PATCH",
      }),
  });

  return {
    create,
    update,
    assignDefault,
    removeDefault,
    acceptInvite,
    declineInvite,
    sendWorkspaceInvites,
    expireWorkspaceInvites,
    removeWorkspaceMembers,
    changeWorkspaceMemberRoles,
  };
};

type UseWorkspaceMembersArgs = {
  sortDirection?: SORT_DIRECTION;
  sortField?: WORKSPACE_MEMBER_SORT_FIELD;
};

export const useWorkspaceMembers = ({
  sortDirection = SORT_DIRECTION.DESC,
  sortField = WORKSPACE_MEMBER_SORT_FIELD.EMAIL,
}: UseWorkspaceMembersArgs) => {
  const {
    defaultWorkspace: {
      workspace: { id: workspaceId },
    },
  } = useAccount();

  const queryKey = useMemo(() => {
    return [
      QUERY_KEYS.WORKSPACE_MEMBERS,
      workspaceId,
      {
        sortDirection,
        sortField,
      },
    ];
  }, [sortDirection, sortField, workspaceId]);

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const queryParams = new URLSearchParams({
        cursor: pageParam,
        direction: PAGINATION_DIRECTION.FORWARD,
        limit: "20",
        sortDirection,
        sortField,
      });
      return get<FindWorkspaceMembersResponseBody>(
        `/workspace/${workspaceId}/member?${queryParams.toString()}`,
      );
    },
    getNextPageParam: (lastPage) => {
      const { hasNextPage, endCursor } = lastPage;
      return hasNextPage ? endCursor : undefined;
    },
    initialPageParam: "",
    placeholderData: keepPreviousData,
  });

  const allWorkspaceMembers = data?.pages.flatMap((page) => page.nodes) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return {
    data: allWorkspaceMembers,
    totalCount,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
};

type UseWorkspaceInvitesArgs = {
  sortDirection?: SORT_DIRECTION;
  sortField?: WORKSPACE_EMAIL_INVITE_SORT_FIELD;
};

export const useWorkspaceInvites = ({
  sortDirection = SORT_DIRECTION.DESC,
  sortField = WORKSPACE_EMAIL_INVITE_SORT_FIELD.CREATED_AT,
}: UseWorkspaceInvitesArgs) => {
  const {
    defaultWorkspace: {
      workspace: { id: workspaceId },
    },
  } = useAccount();

  const queryKey = useMemo(() => {
    return [
      QUERY_KEYS.WORKSPACE_INVITES,
      workspaceId,
      {
        sortDirection,
        sortField,
      },
    ];
  }, [sortDirection, sortField, workspaceId]);

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const queryParams = new URLSearchParams({
        cursor: pageParam,
        direction: PAGINATION_DIRECTION.FORWARD,
        limit: "20",
        sortDirection,
        sortField,
      });

      return get<FindWorkspaceEmailInvitesResponseBody>(
        `/workspace/${workspaceId}/invite/email?${queryParams.toString()}`,
      );
    },
    getNextPageParam: (lastPage) => {
      const { hasNextPage, endCursor } = lastPage;
      return hasNextPage ? endCursor : undefined;
    },
    initialPageParam: "",
    placeholderData: keepPreviousData,
  });

  const allInvites = data?.pages.flatMap((page) => page.nodes) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return {
    data: allInvites,
    totalCount,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
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
