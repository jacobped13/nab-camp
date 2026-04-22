import {
  type CreateCheckoutSessionRequestBody,
  type CreateCheckoutSessionResponseBody,
  type FindAllSubscriptionPlansResponseBody,
  type FindCheckoutSessionByIdResponseBody,
  type FindSubscriptionPlanPathsByIdResponseBody,
} from "@shared/api-contracts/billing";
import { PAGINATION_DIRECTION } from "@shared/api-contracts/common";
import {
  type CancelWorkspaceAccessSubscriptionResponseBody,
  type ChangeWorkspaceAccessSubscriptionPlanRequestBody,
  type ChangeWorkspaceAccessSubscriptionPlanResponseBody,
  type CreateWorkspacePaymentMethodManagementSessionRequestBody,
  type CreateWorkspacePaymentMethodManagementSessionResponseBody,
  type FindWorkspaceInvoicesResponseBody,
  type ResumeCancelledWorkspaceAccessSubscriptionResponseBody,
  type SendBusinessContactRequestBody,
  type SendBusinessContactResponseBody,
} from "@shared/api-contracts/workspace";
import { TIMING } from "@shared/lib/timing";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { useAccount } from "@/hooks/use-account";
import { get, mutate } from "@/network/base";
import { QUERY_KEYS } from "@/network/query-keys";

type DownloadInvoiceParams = {
  date: number;
  downloadUrl: string;
};

const BILLING_MUTATION_KEYS = {
  CREATE_CHECKOUT_SESSION: ["createCheckoutSession"],
  CANCEL_SUBSCRIPTION: ["cancelSubscription"],
  RESUME_SUBSCRIPTION: ["resumeSubscription"],
  UPDATE_PAYMENT_METHOD: ["updatePaymentMethod"],
  CHANGE_SUBSCRIPTION_PLAN: ["changeSubscriptionPlan"],
  CONTACT_BUSINESS_SALES: ["contactBusinessSales"],
  DOWNLOAD_INVOICE: ["downloadInvoice"],
};

export const useBillingMutations = () => {
  const {
    defaultWorkspace: {
      workspace: { id: workspaceId },
    },
  } = useAccount();

  const createCheckoutSession = useMutation({
    mutationKey: BILLING_MUTATION_KEYS.CREATE_CHECKOUT_SESSION,
    mutationFn: (data: CreateCheckoutSessionRequestBody) =>
      mutate<
        CreateCheckoutSessionResponseBody,
        CreateCheckoutSessionRequestBody
      >("/billing/checkout-session", {
        method: "POST",
        payload: data,
      }),
  });

  const cancelSubscription = useMutation({
    mutationKey: BILLING_MUTATION_KEYS.CANCEL_SUBSCRIPTION,
    mutationFn: () =>
      mutate<CancelWorkspaceAccessSubscriptionResponseBody, void>(
        `/workspace/${workspaceId}/subscription/cancel`,
        {
          method: "POST",
        },
      ),
  });

  const resumeSubscription = useMutation({
    mutationKey: BILLING_MUTATION_KEYS.CANCEL_SUBSCRIPTION,
    mutationFn: () =>
      mutate<ResumeCancelledWorkspaceAccessSubscriptionResponseBody, void>(
        `/workspace/${workspaceId}/subscription/resume`,
        {
          method: "POST",
        },
      ),
  });

  const updatePaymentMethod = useMutation({
    mutationKey: BILLING_MUTATION_KEYS.UPDATE_PAYMENT_METHOD,
    mutationFn: ({
      returnPath,
    }: CreateWorkspacePaymentMethodManagementSessionRequestBody) =>
      mutate<
        CreateWorkspacePaymentMethodManagementSessionResponseBody,
        CreateWorkspacePaymentMethodManagementSessionRequestBody
      >(`workspace/${workspaceId}/payment-method/session`, {
        method: "POST",
        payload: { returnPath },
      }),
  });

  const changeSubscriptionPlan = useMutation({
    mutationKey: BILLING_MUTATION_KEYS.CHANGE_SUBSCRIPTION_PLAN,
    mutationFn: ({
      planId,
    }: ChangeWorkspaceAccessSubscriptionPlanRequestBody) =>
      mutate<
        ChangeWorkspaceAccessSubscriptionPlanResponseBody,
        ChangeWorkspaceAccessSubscriptionPlanRequestBody
      >(`workspace/${workspaceId}/subscription/plan`, {
        method: "PUT",
        payload: { planId },
      }),
  });

  const contactBusinessSales = useMutation({
    mutationKey: BILLING_MUTATION_KEYS.CONTACT_BUSINESS_SALES,
    mutationFn: (data: SendBusinessContactRequestBody) =>
      mutate<SendBusinessContactResponseBody, SendBusinessContactRequestBody>(
        "/workspace/send-business-contact",
        {
          method: "POST",
          payload: data,
        },
      ),
  });

  const downloadInvoice = useMutation({
    mutationKey: BILLING_MUTATION_KEYS.DOWNLOAD_INVOICE,
    mutationFn: async ({ downloadUrl }: DownloadInvoiceParams) => {
      window.open(downloadUrl, "_blank");
    },
  });

  return {
    createCheckoutSession,
    cancelSubscription,
    resumeSubscription,
    updatePaymentMethod,
    changeSubscriptionPlan,
    contactBusinessSales,
    downloadInvoice,
  };
};

export const useCheckoutStatusQuery = (sessionId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHECKOUT_STATUS, sessionId],
    refetchInterval: TIMING.SECOND.IN_MILLISECONDS * 2,
    enabled: !!sessionId,
    queryFn: () =>
      get<FindCheckoutSessionByIdResponseBody>(
        `/billing/checkout-session/${sessionId}`,
      ),
  });
};

export const useSubscriptionPlansQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTION_PLANS,
    queryFn: () => get<FindAllSubscriptionPlansResponseBody>("/billing/plan"),
  });
};

export const useUpgradeDowngradePlansQuery = (planId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.UPGRADE_DOWNGRADE_PLANS, planId],
    queryFn: () =>
      get<FindSubscriptionPlanPathsByIdResponseBody>(
        `/billing/plan/${planId}/path`,
      ),
  });
};

export const useWorkspaceInvoices = () => {
  const {
    defaultWorkspace: {
      workspace: { id: workspaceId },
    },
  } = useAccount();

  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.INVOICES, workspaceId],
    queryFn: async ({ pageParam }) => {
      const queryParams = new URLSearchParams({
        cursor: pageParam,
        direction: PAGINATION_DIRECTION.FORWARD,
        limit: "20",
      });

      return get<FindWorkspaceInvoicesResponseBody>(
        `/workspace/${workspaceId}/invoice?${queryParams.toString()}`,
      );
    },
    getNextPageParam: (lastPage) => {
      const { hasNextPage, endCursor } = lastPage;
      return hasNextPage ? endCursor : undefined;
    },
    initialPageParam: "",
    placeholderData: keepPreviousData,
  });

  const allInvoices = data?.pages.flatMap((page) => page.nodes) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return {
    data: allInvoices,
    totalCount,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
};
