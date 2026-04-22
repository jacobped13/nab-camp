import { z } from 'zod';
import {
  BILLING_PROVIDER,
  BILLING_PROVIDER_INVOICE_STATUS,
  BILLING_PROVIDER_PRICE_STATUS,
  BILLING_PROVIDER_PRODUCT_STATUS,
  BILLING_PROVIDER_STAKEHOLDER_TYPE,
  BILLING_PROVIDER_SUBSCRIPTION_STATUS,
  SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY,
  SUBSCRIPTION_PLAN_SETUP_TYPE,
  SUBSCRIPTION_PLAN_TYPE,
  SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET,
} from '../../common/billing.constant';
import { BusinessResultInputContextErrorDto } from '@common';
import {
  CustomerConnectionEntity,
  PriceConnectionEntity,
  ProductConnectionEntity,
  SubscriptionConnectionEntity,
  SubscriptionItemConnectionEntity,
} from '../../data/helper/billing.data.model';
import {
  ProviderBillingManagementSession,
  ProviderCheckoutSession,
  ProviderCustomer,
  ProviderInvoice,
  ProviderSubscription,
  ProviderSubscriptionItem,
} from '../../provider/helper/billing.provider.model';
import { BillingProviderEventLogEntity } from '../../data/helper/billing.data.model';
import { SubscriptionPlan } from './billing.business.model';
import {
  CursorPaginationInputDtoSchema,
  CursorPaginationOutputDto,
} from '@lib/util/pagination.util';

// -----------------------------------------------------------------
// Shared
// -----------------------------------------------------------------

export type SubscriptionPlanPathDtoInput = {
  upgrades: SubscriptionPlan[];
  downgrades: SubscriptionPlan[];
  sidegrades: SubscriptionPlan[];
};

export class SubscriptionPlanPathDto {
  private _plans: SubscriptionPlan[] | undefined;
  private _downgradeIdSet: Set<string> | undefined;
  private _upgradeIdSet: Set<string> | undefined;
  private _sideGradeIdSet: Set<string> | undefined;

  constructor(
    public readonly downgrades: SubscriptionPlan[],
    public readonly upgrades: SubscriptionPlan[],
    public readonly sidegrades: SubscriptionPlan[]
  ) {}

  public get plans(): SubscriptionPlan[] {
    if (!this._plans) {
      this._plans = [...this.downgrades, ...this.upgrades, ...this.sidegrades];
    }
    return this._plans;
  }

  private get upgradeIdSet(): Set<string> {
    if (!this._upgradeIdSet) {
      this._upgradeIdSet = new Set(this.upgrades.map((plan) => plan.id));
    }
    return this._upgradeIdSet;
  }

  private get downgradeIdSet(): Set<string> {
    if (!this._downgradeIdSet) {
      this._downgradeIdSet = new Set(this.downgrades.map((plan) => plan.id));
    }
    return this._downgradeIdSet;
  }

  private get sideGradeIdSet(): Set<string> {
    if (!this._sideGradeIdSet) {
      this._sideGradeIdSet = new Set(this.sidegrades.map((plan) => plan.id));
    }
    return this._sideGradeIdSet;
  }

  public isUpgrade(planId: string): boolean {
    return this.upgradeIdSet.has(planId);
  }

  public isDowngrade(planId: string): boolean {
    return this.downgradeIdSet.has(planId);
  }

  public isSideGrade(planId: string): boolean {
    return this.sideGradeIdSet.has(planId);
  }

  public static withEmptyPaths(): SubscriptionPlanPathDto {
    return new SubscriptionPlanPathDto([], [], []);
  }

  public static with(
    input: SubscriptionPlanPathDtoInput
  ): SubscriptionPlanPathDto {
    return new SubscriptionPlanPathDto(
      input.downgrades,
      input.upgrades,
      input.sidegrades
    );
  }
}

export type SubscriptionItemConnectionPlanDto = {
  connection: SubscriptionItemConnectionEntity;
  plan: SubscriptionPlan;
};

export type CustomerDto = {
  connection: CustomerConnectionEntity;
  provider: ProviderCustomer;
};

export const SubscriptionConnectionFilterSchema = z.object({
  statuses: z
    .array(z.nativeEnum(BILLING_PROVIDER_SUBSCRIPTION_STATUS))
    .optional(),
});

export const SubscriptionPlanFamilyFilterSchema = z.object({
  types: z.array(z.nativeEnum(SUBSCRIPTION_PLAN_TYPE)).optional(),
  setupTypes: z.array(z.nativeEnum(SUBSCRIPTION_PLAN_SETUP_TYPE)).optional(),
});

export const BillingProviderInvoiceFilterSchema = z.object({
  status: z.array(z.nativeEnum(BILLING_PROVIDER_INVOICE_STATUS)).optional(),
});

// -----------------------------------------------------------------
// Find Customer Connection By ID
// -----------------------------------------------------------------

export const FindCustomerConnectionByIdInputDtoSchema = z.object({
  customerId: z.string(),
});

export type FindCustomerConnectionByIdInputDto = z.infer<
  typeof FindCustomerConnectionByIdInputDtoSchema
>;

export type FindCustomerConnectionByIdOutputDto = {
  connection: CustomerConnectionEntity;
};

export type FindCustomerConnectionByIdErrorDto =
  BusinessResultInputContextErrorDto<FindCustomerConnectionByIdInputDto>;

// -----------------------------------------------------------------
// Find Customer Connection By Provider
// -----------------------------------------------------------------

export const FindCustomerConnectionByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type FindCustomerConnectionByProviderInputDto = z.infer<
  typeof FindCustomerConnectionByProviderInputDtoSchema
>;

export type FindCustomerConnectionByProviderOutputDto = {
  connection: CustomerConnectionEntity;
};

export type FindCustomerConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<FindCustomerConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Find Customer Connection By Stakeholder
// -----------------------------------------------------------------

export const FindCustomerConnectionByStakeholderInputDtoSchema = z.object({
  stakeholderId: z.string(),
  stakeholderType: z.nativeEnum(BILLING_PROVIDER_STAKEHOLDER_TYPE),
});

export type FindCustomerConnectionByStakeholderInputDto = z.infer<
  typeof FindCustomerConnectionByStakeholderInputDtoSchema
>;

export type FindCustomerConnectionByStakeholderOutputDto = {
  connection: CustomerConnectionEntity;
};

export type FindCustomerConnectionByStakeholderErrorDto =
  BusinessResultInputContextErrorDto<FindCustomerConnectionByStakeholderInputDto>;

// -----------------------------------------------------------------
// Find All Customer Connection By Stakeholders
// -----------------------------------------------------------------

export const FindAllCustomerConnectionsByStakeholdersInputDtoSchema = z.object({
  stakeholders: z.array(
    z.object({
      stakeholderId: z.string(),
      stakeholderType: z.nativeEnum(BILLING_PROVIDER_STAKEHOLDER_TYPE),
    })
  ),
});

export type FindAllCustomerConnectionsByStakeholdersInputDto = z.infer<
  typeof FindAllCustomerConnectionsByStakeholdersInputDtoSchema
>;

export type FindAllCustomerConnectionsByStakeholdersOutputDto = {
  connections: CustomerConnectionEntity[];
};

export type FindAllCustomerConnectionsByStakeholdersErrorDto =
  BusinessResultInputContextErrorDto<FindAllCustomerConnectionsByStakeholdersInputDto>;

// -----------------------------------------------------------------
// Find Customer by Provider
// -----------------------------------------------------------------

export const FindCustomerByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type FindCustomerByProviderInputDto = z.infer<
  typeof FindCustomerByProviderInputDtoSchema
>;

export type FindCustomerByProviderOutputDto = CustomerDto;

export type FindCustomerByProviderErrorDto =
  BusinessResultInputContextErrorDto<FindCustomerByProviderInputDto>;

// -----------------------------------------------------------------
// Find Customer by Stakeholder
// -----------------------------------------------------------------

export const FindCustomerByStakeholderInputDtoSchema = z.object({
  stakeholderId: z.string(),
  stakeholderType: z.nativeEnum(BILLING_PROVIDER_STAKEHOLDER_TYPE),
});

export type FindCustomerByStakeholderInputDto = z.infer<
  typeof FindCustomerByStakeholderInputDtoSchema
>;

export type FindCustomerByStakeholderOutputDto = CustomerDto;

export type FindCustomerByStakeholderErrorDto =
  BusinessResultInputContextErrorDto<FindCustomerByStakeholderInputDto>;

// -----------------------------------------------------------------
// Create Customer Connection
// -----------------------------------------------------------------

export const CreateCustomerConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  stakeholderType: z.nativeEnum(BILLING_PROVIDER_STAKEHOLDER_TYPE),
  stakeholderId: z.string(),
});

export type CreateCustomerConnectionInputDto = z.infer<
  typeof CreateCustomerConnectionInputDtoSchema
>;

export type CreateCustomerConnectionOutputDto = {
  connection: CustomerConnectionEntity;
};

export type CreateCustomerConnectionErrorDto =
  BusinessResultInputContextErrorDto<CreateCustomerConnectionInputDto>;

// -----------------------------------------------------------------
// Create Customer
// -----------------------------------------------------------------

export const CreateCustomerInputDtoSchema = z.object({
  email: z.string().email(),
  provider: z.nativeEnum(BILLING_PROVIDER),
  stakeholderType: z.nativeEnum(BILLING_PROVIDER_STAKEHOLDER_TYPE),
  stakeholderId: z.string(),
});

export type CreateCustomerInputDto = z.infer<
  typeof CreateCustomerInputDtoSchema
>;

export type CreateCustomerOutputDto = CustomerDto;

export type CreateCustomerErrorDto =
  BusinessResultInputContextErrorDto<CreateCustomerInputDto>;

// -----------------------------------------------------------------
// Create Provider Subscription Checkout Session
// -----------------------------------------------------------------

export const CreateProviderSubscriptionCheckoutSessionInputDtoSchema = z.object(
  {
    provider: z.nativeEnum(BILLING_PROVIDER),
    providerCustomerId: z.string(),
    providerPriceId: z.string(),
    quantity: z.number().int().positive(),
    redirectUrl: z.string().url(),
  }
);

export type CreateProviderSubscriptionCheckoutSessionInputDto = z.infer<
  typeof CreateProviderSubscriptionCheckoutSessionInputDtoSchema
>;

export type CreateProviderSubscriptionCheckoutSessionOutputDto = {
  session: ProviderCheckoutSession;
};

export type CreateProviderSubscriptionCheckoutSessionErrorDto =
  BusinessResultInputContextErrorDto<CreateProviderSubscriptionCheckoutSessionInputDto>;

// -----------------------------------------------------------------
// Find Provider Checkout Session by ID
// -----------------------------------------------------------------

export const FindProviderCheckoutSessionByIdInputDtoSchema = z.object({
  sessionId: z.string(),
  provider: z.nativeEnum(BILLING_PROVIDER),
});

export type FindProviderCheckoutSessionByIdInputDto = z.infer<
  typeof FindProviderCheckoutSessionByIdInputDtoSchema
>;

export type FindProviderCheckoutSessionByIdOutputDto = {
  session: ProviderCheckoutSession;
};

export type FindProviderCheckoutSessionByIdErrorDto =
  BusinessResultInputContextErrorDto<FindProviderCheckoutSessionByIdInputDto>;

// -----------------------------------------------------------------
// Find or Create Provider Event
// -----------------------------------------------------------------

export const FindOrCreateProviderEventLogInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  publishedAt: z.date(),
});

export type FindOrCreateProviderEventLogInputDto = z.infer<
  typeof FindOrCreateProviderEventLogInputDtoSchema
>;

export type FindOrCreateProviderEventLogOutputDto = {
  event: BillingProviderEventLogEntity;
  created: boolean;
};

export type FindOrCreateProviderEventLogErrorDto =
  BusinessResultInputContextErrorDto<FindOrCreateProviderEventLogInputDto>;

// -----------------------------------------------------------------
// Process Provider Event
// -----------------------------------------------------------------

export const ProcessProviderEventLogInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type ProcessProviderEventLogInputDto = z.infer<
  typeof ProcessProviderEventLogInputDtoSchema
>;

export type ProcessProviderEventLogOutputDto = {
  event: BillingProviderEventLogEntity;
};

export type ProcessProviderEventLogErrorDto =
  BusinessResultInputContextErrorDto<ProcessProviderEventLogInputDto>;

// -----------------------------------------------------------------
// Delete Provider Event Log
// -----------------------------------------------------------------

export const DeleteProviderEventLogInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type DeleteProviderEventLogInputDto = z.infer<
  typeof DeleteProviderEventLogInputDtoSchema
>;

export type DeleteProviderEventLogOutputDto = {
  event: BillingProviderEventLogEntity;
};

export type DeleteProviderEventLogErrorDto =
  BusinessResultInputContextErrorDto<DeleteProviderEventLogInputDto>;

// -----------------------------------------------------------------
// Find Subscription Connection by Id
// -----------------------------------------------------------------

export const FindSubscriptionConnectionByIdInputDtoSchema = z.object({
  subscriptionId: z.string(),
});

export type FindSubscriptionConnectionByIdInputDto = z.infer<
  typeof FindSubscriptionConnectionByIdInputDtoSchema
>;

export type FindSubscriptionConnectionByIdOutputDto = {
  connection: SubscriptionConnectionEntity;
};

export type FindSubscriptionConnectionByIdErrorDto =
  BusinessResultInputContextErrorDto<FindSubscriptionConnectionByIdInputDto>;

// -----------------------------------------------------------------
// Find Subscription Connection by Provider
// -----------------------------------------------------------------

export const FindSubscriptionConnectionByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type FindSubscriptionConnectionByProviderInputDto = z.infer<
  typeof FindSubscriptionConnectionByProviderInputDtoSchema
>;

export type FindSubscriptionConnectionByProviderOutputDto = {
  connection: SubscriptionConnectionEntity;
};

export type FindSubscriptionConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<FindSubscriptionConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Connections by Customer IDs
// -----------------------------------------------------------------

export const FindAllSubscriptionConnectionsByCustomerIdsInputDtoSchema =
  z.object({
    customerIds: z.array(z.string()),
    filter: SubscriptionConnectionFilterSchema.optional(),
  });

export type FindAllSubscriptionConnectionsByCustomerIdsInputDto = z.infer<
  typeof FindAllSubscriptionConnectionsByCustomerIdsInputDtoSchema
>;

export type FindAllSubscriptionConnectionsByCustomerIdsOutputDto = {
  connections: SubscriptionConnectionEntity[];
  connectionMap: Map<string, SubscriptionConnectionEntity[]>;
};

export type FindAllSubscriptionConnectionsByCustomerIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionConnectionsByCustomerIdsInputDto>;

// -----------------------------------------------------------------
// Find or Create Subscription Connection
// -----------------------------------------------------------------

export const FindOrCreateSubscriptionConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string().optional(),
  customerId: z.string(),
  status: z.nativeEnum(BILLING_PROVIDER_SUBSCRIPTION_STATUS).refine(
    (status) => {
      return SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET.has(status);
    },
    {
      message: 'Unsupported subscription status',
    }
  ),
  cancelAt: z.date().nullable(),
});

export type FindOrCreateSubscriptionConnectionInputDto = z.infer<
  typeof FindOrCreateSubscriptionConnectionInputDtoSchema
>;

export type FindOrCreateSubscriptionConnectionOutputDto = {
  created: boolean;
  connection: SubscriptionConnectionEntity;
};

export type FindOrCreateSubscriptionConnectionErrorDto =
  BusinessResultInputContextErrorDto<FindOrCreateSubscriptionConnectionInputDto>;

// -----------------------------------------------------------------
// Update Subscription Connection by Provider
// -----------------------------------------------------------------

export const UpdateSubscriptionConnectionByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string(),
  status: z.nativeEnum(BILLING_PROVIDER_SUBSCRIPTION_STATUS).refine(
    (status) => {
      return SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET.has(status);
    },
    {
      message: 'Unsupported subscription status',
    }
  ),
  cancelAt: z.date().nullable().optional(),
});

export type UpdateSubscriptionConnectionByProviderInputDto = z.infer<
  typeof UpdateSubscriptionConnectionByProviderInputDtoSchema
>;

export type UpdateSubscriptionConnectionByProviderOutputDto = {
  connection: SubscriptionConnectionEntity;
};

export type UpdateSubscriptionConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<UpdateSubscriptionConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Hydrate Subscription Connection
// -----------------------------------------------------------------

export const HydrateSubscriptionConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string(),
  customerId: z.string(),
  status: z.nativeEnum(BILLING_PROVIDER_SUBSCRIPTION_STATUS).refine(
    (status) => {
      return SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET.has(status);
    },
    {
      message: 'Unsupported subscription status',
    }
  ),
  cancelAt: z.date().nullable(),
});

export type HydrateSubscriptionConnectionInputDto = z.infer<
  typeof HydrateSubscriptionConnectionInputDtoSchema
>;

export type HydrateSubscriptionConnectionOutputDto = {
  connection: SubscriptionConnectionEntity;
  created: boolean;
  hydrated: boolean;
};

export type HydrateSubscriptionConnectionErrorDto =
  BusinessResultInputContextErrorDto<HydrateSubscriptionConnectionInputDto>;

// -----------------------------------------------------------------
// Hydrate Customer Subscription Connection
// -----------------------------------------------------------------

export const HydrateCustomerSubscriptionConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  customerProviderId: z.string(),
  subscriptionProviderId: z.string(),
  subscriptionProviderVersion: z.string(),
  subscriptionStatus: z.nativeEnum(BILLING_PROVIDER_SUBSCRIPTION_STATUS).refine(
    (status) => {
      return SUPPORTED_BILLING_PROVIDER_SUBSCRIPTION_STATUS_SET.has(status);
    },
    {
      message: 'Unsupported subscription status',
    }
  ),
  cancelAt: z.date().nullable(),
});

export type HydrateCustomerSubscriptionConnectionInputDto = z.infer<
  typeof HydrateCustomerSubscriptionConnectionInputDtoSchema
>;

export type HydrateCustomerSubscriptionConnectionOutputDto = {
  connection: SubscriptionConnectionEntity;
  created: boolean;
  hydrated: boolean;
};

export type HydrateCustomerSubscriptionConnectionErrorDto =
  BusinessResultInputContextErrorDto<HydrateCustomerSubscriptionConnectionInputDto>;

// -----------------------------------------------------------------
// Delete All Terminal Subscription Connections by Customer ID
// -----------------------------------------------------------------

export const DeleteAllTerminalSubscriptionConnectionsByCustomerIdInputDtoSchema =
  z.object({
    customerId: z.string(),
  });

export type DeleteAllTerminalSubscriptionConnectionsByCustomerIdInputDto =
  z.infer<
    typeof DeleteAllTerminalSubscriptionConnectionsByCustomerIdInputDtoSchema
  >;

export type DeleteAllTerminalSubscriptionConnectionsByCustomerIdOutputDto = {
  connections: SubscriptionConnectionEntity[];
};

export type DeleteAllTerminalSubscriptionConnectionsByCustomerIdErrorDto =
  BusinessResultInputContextErrorDto<DeleteAllTerminalSubscriptionConnectionsByCustomerIdInputDto>;

// -----------------------------------------------------------------
// Find Subscription Item Connection by Provider
// -----------------------------------------------------------------

export const FindSubscriptionItemConnectionByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type FindSubscriptionItemConnectionByProviderInputDto = z.infer<
  typeof FindSubscriptionItemConnectionByProviderInputDtoSchema
>;

export type FindSubscriptionItemConnectionByProviderOutputDto = {
  connection: SubscriptionItemConnectionEntity;
};

export type FindSubscriptionItemConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<FindSubscriptionItemConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Item Connections By Subscription ID
// -----------------------------------------------------------------

export const FindAllSubscriptionItemConnectionsBySubscriptionIdInputDtoSchema =
  z.object({
    subscriptionId: z.string(),
  });

export type FindAllSubscriptionItemConnectionsBySubscriptionIdInputDto =
  z.infer<
    typeof FindAllSubscriptionItemConnectionsBySubscriptionIdInputDtoSchema
  >;

export type FindAllSubscriptionItemConnectionsBySubscriptionIdOutputDto = {
  connections: SubscriptionItemConnectionEntity[];
};

export type FindAllSubscriptionItemConnectionsBySubscriptionIdErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionItemConnectionsBySubscriptionIdInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Item Connections By Subscription IDs
// -----------------------------------------------------------------

export const FindAllSubscriptionItemConnectionsBySubscriptionIdsInputDtoSchema =
  z.object({
    subscriptionIds: z.array(z.string()),
  });

export type FindAllSubscriptionItemConnectionsBySubscriptionIdsInputDto =
  z.infer<
    typeof FindAllSubscriptionItemConnectionsBySubscriptionIdsInputDtoSchema
  >;

export type FindAllSubscriptionItemConnectionsBySubscriptionIdsOutputDto = {
  connections: SubscriptionItemConnectionEntity[];
  connectionMap: Map<string, SubscriptionItemConnectionEntity[]>;
};

export type FindAllSubscriptionItemConnectionsBySubscriptionIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionItemConnectionsBySubscriptionIdsInputDto>;

// -----------------------------------------------------------------
// Find or Create Subscription Item Connection
// -----------------------------------------------------------------

export const FindOrCreateSubscriptionItemConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string(),
  subscriptionId: z.string(),
  priceId: z.string(),
  quantity: z.number().int().positive(),
  currentPeriodStartAt: z.date(),
  currentPeriodEndAt: z.date(),
});

export type FindOrCreateSubscriptionItemConnectionInputDto = z.infer<
  typeof FindOrCreateSubscriptionItemConnectionInputDtoSchema
>;

export type FindOrCreateSubscriptionItemConnectionOutputDto = {
  created: boolean;
  connection: SubscriptionItemConnectionEntity;
};

export type FindOrCreateSubscriptionItemConnectionErrorDto =
  BusinessResultInputContextErrorDto<FindOrCreateSubscriptionItemConnectionInputDto>;

// -----------------------------------------------------------------
// Update Subscription Item Connection by Provider
// -----------------------------------------------------------------

export const UpdateSubscriptionItemConnectionByProviderInputDtoSchema =
  z.object({
    provider: z.nativeEnum(BILLING_PROVIDER),
    providerId: z.string(),
    providerVersion: z.string(),
    priceId: z.string(),
    quantity: z.number().int().positive(),
    currentPeriodStartAt: z.date().optional(),
    currentPeriodEndAt: z.date().optional(),
  });

export type UpdateSubscriptionItemConnectionByProviderInputDto = z.infer<
  typeof UpdateSubscriptionItemConnectionByProviderInputDtoSchema
>;

export type UpdateSubscriptionItemConnectionByProviderOutputDto = {
  connection: SubscriptionItemConnectionEntity;
};

export type UpdateSubscriptionItemConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<UpdateSubscriptionItemConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Delete Subscription Item Connections
// -----------------------------------------------------------------

export const DeleteSubscriptionItemConnectionsInputDtoSchema = z.object({
  subscriptionItemIds: z.array(z.string()),
});

export type DeleteSubscriptionItemConnectionsInputDto = z.infer<
  typeof DeleteSubscriptionItemConnectionsInputDtoSchema
>;

export type DeleteSubscriptionItemConnectionsOutputDto = {
  connections: SubscriptionItemConnectionEntity[];
};

export type DeleteSubscriptionItemConnectionsErrorDto =
  BusinessResultInputContextErrorDto<DeleteSubscriptionItemConnectionsInputDto>;

// -----------------------------------------------------------------
// Hydrate Subscription Item Connection
// -----------------------------------------------------------------

export const HydrateSubscriptionItemConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerPriceId: z.string(),
  providerVersion: z.string(),
  subscriptionId: z.string(),
  quantity: z.number().int().positive(),
  currentPeriodStartAt: z.date(),
  currentPeriodEndAt: z.date(),
});

export type HydrateSubscriptionItemConnectionInputDto = z.infer<
  typeof HydrateSubscriptionItemConnectionInputDtoSchema
>;

export type HydrateSubscriptionItemConnectionOutputDto = {
  connection: SubscriptionItemConnectionEntity;
  created: boolean;
  hydrated: boolean;
};

export type HydrateSubscriptionItemConnectionErrorDto =
  BusinessResultInputContextErrorDto<HydrateSubscriptionItemConnectionInputDto>;

// -----------------------------------------------------------------
// Hydrate All Subscription Item Connections
// -----------------------------------------------------------------

export const HydrateAllSubscriptionItemConnectionsInputDtoSchema = z.object({
  subscriptionId: z.string(),
  providerSubscriptionItems: z.array(
    z.object({
      providerId: z.string(),
      providerVersion: z.string(),
      providerPriceId: z.string(),
      quantity: z.number().int().positive(),
      currentPeriodStartAt: z.date(),
      currentPeriodEndAt: z.date(),
    })
  ),
});

export type HydrateAllSubscriptionItemConnectionsInputDto = z.infer<
  typeof HydrateAllSubscriptionItemConnectionsInputDtoSchema
>;

export type HydrateAllSubscriptionItemConnectionsOutputDto = {
  results: {
    connection: SubscriptionItemConnectionEntity;
    created: boolean;
    hydrated: boolean;
    deleted: boolean;
  }[];
};

export type HydrateAllSubscriptionItemConnectionsErrorDto =
  BusinessResultInputContextErrorDto<HydrateAllSubscriptionItemConnectionsInputDto>;

// -----------------------------------------------------------------
// Find Product Connection by Provider
// -----------------------------------------------------------------

export const FindProductConnectionByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type FindProductConnectionByProviderInputDto = z.infer<
  typeof FindProductConnectionByProviderInputDtoSchema
>;

export type FindProductConnectionByProviderOutputDto = {
  connection: ProductConnectionEntity;
};

export type FindProductConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<FindProductConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Find or Create Product Connection
// -----------------------------------------------------------------

export const FindOrCreateProductConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string().optional(),
  status: z.nativeEnum(BILLING_PROVIDER_PRODUCT_STATUS),
});

export type FindOrCreateProductConnectionInputDto = z.infer<
  typeof FindOrCreateProductConnectionInputDtoSchema
>;

export type FindOrCreateProductConnectionOutputDto = {
  created: boolean;
  connection: ProductConnectionEntity;
};

export type FindOrCreateProductConnectionErrorDto =
  BusinessResultInputContextErrorDto<FindOrCreateProductConnectionInputDto>;

// -----------------------------------------------------------------
// Update Product Connection by Provider
// -----------------------------------------------------------------

export const UpdateProductConnectionByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string(),
  status: z.nativeEnum(BILLING_PROVIDER_PRODUCT_STATUS),
});

export type UpdateProductConnectionByProviderInputDto = z.infer<
  typeof UpdateProductConnectionByProviderInputDtoSchema
>;

export type UpdateProductConnectionByProviderOutputDto = {
  connection: ProductConnectionEntity;
};

export type UpdateProductConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<UpdateProductConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Hydrate Product Connection
// -----------------------------------------------------------------

export const HydrateProductConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string(),
  status: z.nativeEnum(BILLING_PROVIDER_PRODUCT_STATUS),
});

export type HydrateProductConnectionInputDto = z.infer<
  typeof HydrateProductConnectionInputDtoSchema
>;

export type HydrateProductConnectionOutputDto = {
  connection: ProductConnectionEntity;
  created: boolean;
  hydrated: boolean;
};

export type HydrateProductConnectionErrorDto =
  BusinessResultInputContextErrorDto<HydrateProductConnectionInputDto>;

// -----------------------------------------------------------------
// Delete Product Connection
// -----------------------------------------------------------------

export const DeleteProductConnectionInputDtoSchema = z.object({
  productId: z.string(),
});

export type DeleteProductConnectionInputDto = z.infer<
  typeof DeleteProductConnectionInputDtoSchema
>;

export type DeleteProductConnectionOutputDto = {
  connection: ProductConnectionEntity;
};

export type DeleteProductConnectionErrorDto =
  BusinessResultInputContextErrorDto<DeleteProductConnectionInputDto>;

// -----------------------------------------------------------------
// Find Price Connection by ID
// -----------------------------------------------------------------

export const FindPriceConnectionByIdInputDtoSchema = z.object({
  priceId: z.string(),
});

export type FindPriceConnectionByIdInputDto = z.infer<
  typeof FindPriceConnectionByIdInputDtoSchema
>;

export type FindPriceConnectionByIdOutputDto = {
  connection: PriceConnectionEntity;
};

export type FindPriceConnectionByIdErrorDto =
  BusinessResultInputContextErrorDto<FindPriceConnectionByIdInputDto>;

// -----------------------------------------------------------------
// Find Price Connection by Provider
// -----------------------------------------------------------------

export const FindPriceConnectionByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type FindPriceConnectionByProviderInputDto = z.infer<
  typeof FindPriceConnectionByProviderInputDtoSchema
>;

export type FindPriceConnectionByProviderOutputDto = {
  connection: PriceConnectionEntity;
};

export type FindPriceConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<FindPriceConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Find or Create Price Connection
// -----------------------------------------------------------------

export const FindOrCreatePriceConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string().optional(),
  productId: z.string(),
  unitAmount: z.number().int().positive().nullable().optional(),
  status: z.nativeEnum(BILLING_PROVIDER_PRICE_STATUS),
});

export type FindOrCreatePriceConnectionInputDto = z.infer<
  typeof FindOrCreatePriceConnectionInputDtoSchema
>;

export type FindOrCreatePriceConnectionOutputDto = {
  created: boolean;
  connection: PriceConnectionEntity;
};

export type FindOrCreatePriceConnectionErrorDto =
  BusinessResultInputContextErrorDto<FindOrCreatePriceConnectionInputDto>;

// -----------------------------------------------------------------
// Update Price Connection by Provider
// -----------------------------------------------------------------

export const UpdatePriceConnectionByProviderInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string(),
  providerUnitAmount: z.number().int().positive().nullable().optional(),
  status: z.nativeEnum(BILLING_PROVIDER_PRICE_STATUS),
});

export type UpdatePriceConnectionByProviderInputDto = z.infer<
  typeof UpdatePriceConnectionByProviderInputDtoSchema
>;

export type UpdatePriceConnectionByProviderOutputDto = {
  connection: PriceConnectionEntity;
};

export type UpdatePriceConnectionByProviderErrorDto =
  BusinessResultInputContextErrorDto<UpdatePriceConnectionByProviderInputDto>;

// -----------------------------------------------------------------
// Hydrate Price Connection
// -----------------------------------------------------------------

export const HydratePriceConnectionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
  providerVersion: z.string(),
  providerProductId: z.string(),
  providerUnitAmount: z.number().int().positive().nullable().optional(),
  status: z.nativeEnum(BILLING_PROVIDER_PRICE_STATUS),
});

export type HydratePriceConnectionInputDto = z.infer<
  typeof HydratePriceConnectionInputDtoSchema
>;

export type HydratePriceConnectionOutputDto = {
  connection: PriceConnectionEntity;
  created: boolean;
  hydrated: boolean;
};

export type HydratePriceConnectionErrorDto =
  BusinessResultInputContextErrorDto<HydratePriceConnectionInputDto>;

// -----------------------------------------------------------------
// Delete Price Connection
// -----------------------------------------------------------------

export const DeletePriceConnectionInputDtoSchema = z.object({
  priceId: z.string(),
});

export type DeletePriceConnectionInputDto = z.infer<
  typeof DeletePriceConnectionInputDtoSchema
>;

export type DeletePriceConnectionOutputDto = {
  connection: PriceConnectionEntity;
};

export type DeletePriceConnectionErrorDto =
  BusinessResultInputContextErrorDto<DeletePriceConnectionInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Plans by Family IDs
// -----------------------------------------------------------------

export const FindAllSubscriptionPlansByFamilyIdsInputDtoSchema = z.object({
  familyIds: z.array(z.string()),
  filter: z
    .object({
      family: SubscriptionPlanFamilyFilterSchema.optional(),
    })
    .optional(),
});

export type FindAllSubscriptionPlansByFamilyIdsInputDto = z.infer<
  typeof FindAllSubscriptionPlansByFamilyIdsInputDtoSchema
>;

export type FindAllSubscriptionPlansByFamilyIdsOutputDto = {
  plans: SubscriptionPlan[];
  planMap: Map<string, SubscriptionPlan[]>;
};

export type FindAllSubscriptionPlansByFamilyIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionPlansByFamilyIdsInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Plans by Price IDs
// -----------------------------------------------------------------

export const FindAllSubscriptionPlansByPriceIdsInputDtoSchema = z.object({
  priceIds: z.array(z.string()),
  filter: z
    .object({
      family: SubscriptionPlanFamilyFilterSchema.optional(),
    })
    .optional(),
});

export type FindAllSubscriptionPlansByPriceIdsInputDto = z.infer<
  typeof FindAllSubscriptionPlansByPriceIdsInputDtoSchema
>;

export type FindAllSubscriptionPlansByPriceIdsOutputDto = {
  plans: SubscriptionPlan[];
  planMap: Map<string, SubscriptionPlan>;
};

export type FindAllSubscriptionPlansByPriceIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionPlansByPriceIdsInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Plans by Subscription IDs
// -----------------------------------------------------------------

export const FindAllSubscriptionPlansBySubscriptionIdsInputDtoSchema = z.object(
  {
    subscriptionIds: z.array(z.string()),
    filter: z
      .object({
        family: SubscriptionPlanFamilyFilterSchema.optional(),
      })
      .optional(),
  }
);

export type FindAllSubscriptionPlansBySubscriptionIdsInputDto = z.infer<
  typeof FindAllSubscriptionPlansBySubscriptionIdsInputDtoSchema
>;

export type FindAllSubscriptionPlansBySubscriptionIdsOutputDto = {
  planMap: Map<string, SubscriptionItemConnectionPlanDto[]>;
};

export type FindAllSubscriptionPlansBySubscriptionIdsErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionPlansBySubscriptionIdsInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Plans by Group Key
// -----------------------------------------------------------------

export const FindAllSubscriptionPlansByFamilyGroupKeyInputDtoSchema = z.object({
  groupKey: z.nativeEnum(SUBSCRIPTION_PLAN_FAMILY_GROUP_KEY),
  filter: z
    .object({
      family: SubscriptionPlanFamilyFilterSchema.optional(),
    })
    .optional(),
});

export type FindAllSubscriptionPlansByFamilyGroupKeyInputDto = z.infer<
  typeof FindAllSubscriptionPlansByFamilyGroupKeyInputDtoSchema
>;

export type FindAllSubscriptionPlansByFamilyGroupKeyOutputDto = {
  plans: SubscriptionPlan[];
};

export type FindAllSubscriptionPlansByFamilyGroupKeyErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionPlansByFamilyGroupKeyInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Plan Family Paths by Family ID
// -----------------------------------------------------------------

export const FindAllSubscriptionPlanFamilyPathsByFamilyIdInputDtoSchema =
  z.object({
    familyId: z.string(),
    filter: z
      .object({
        family: SubscriptionPlanFamilyFilterSchema.optional(),
      })
      .optional(),
  });

export type FindAllSubscriptionPlanFamilyPathsByFamilyIdInputDto = z.infer<
  typeof FindAllSubscriptionPlanFamilyPathsByFamilyIdInputDtoSchema
>;

export type FindAllSubscriptionPlanFamilyPathsByFamilyIdOutputDto = {
  plans: SubscriptionPlan[];
  paths: SubscriptionPlanPathDto;
};

export type FindAllSubscriptionPlanFamilyPathsByFamilyIdErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionPlanFamilyPathsByFamilyIdInputDto>;

// -----------------------------------------------------------------
// Find All Subscription Plan Family Paths by Plan ID
// -----------------------------------------------------------------

export const FindAllSubscriptionPlanFamilyPathsByPlanIdInputDtoSchema =
  z.object({
    planId: z.string(),
    filter: z
      .object({
        family: SubscriptionPlanFamilyFilterSchema.optional(),
      })
      .optional(),
  });

export type FindAllSubscriptionPlanFamilyPathsByPlanIdInputDto = z.infer<
  typeof FindAllSubscriptionPlanFamilyPathsByPlanIdInputDtoSchema
>;

export type FindAllSubscriptionPlanFamilyPathsByPlanIdOutputDto = {
  paths: SubscriptionPlanPathDto;
};

export type FindAllSubscriptionPlanFamilyPathsByPlanIdErrorDto =
  BusinessResultInputContextErrorDto<FindAllSubscriptionPlanFamilyPathsByPlanIdInputDto>;

// -----------------------------------------------------------------
// Create Subscription Plan Checkout Session
// -----------------------------------------------------------------

export const CreateSubscriptionPlanCheckoutSessionInputDtoSchema = z.object({
  customerId: z.string(),
  planId: z.string(),
  quantity: z.number().int().positive(),
  redirectUrl: z.string().url(),
});

export type CreateSubscriptionPlanCheckoutSessionInputDto = z.infer<
  typeof CreateSubscriptionPlanCheckoutSessionInputDtoSchema
>;

export type CreateSubscriptionPlanCheckoutSessionOutputDto = {
  session: ProviderCheckoutSession;
};

export type CreateSubscriptionPlanCheckoutSessionErrorDto =
  BusinessResultInputContextErrorDto<CreateSubscriptionPlanCheckoutSessionInputDto>;

// -----------------------------------------------------------------
// Find Subscription Plan by ID
// -----------------------------------------------------------------

export const FindSubscriptionPlanByIdInputDtoSchema = z.object({
  planId: z.string(),
});

export type FindSubscriptionPlanByIdInputDto = z.infer<
  typeof FindSubscriptionPlanByIdInputDtoSchema
>;

export type FindSubscriptionPlanByIdOutputDto = {
  plan: SubscriptionPlan;
};

export type FindSubscriptionPlanByIdErrorDto =
  BusinessResultInputContextErrorDto<FindSubscriptionPlanByIdInputDto>;

// -----------------------------------------------------------------
// Find All Available Subscription Plans by Plan ID
// -----------------------------------------------------------------

export const FindAllAvailableSubscriptionPlansByPlanIdInputDtoSchema = z.object(
  {
    planId: z.string(),
    quantity: z.number().int().positive(),
    filter: z
      .object({
        family: SubscriptionPlanFamilyFilterSchema.optional(),
      })
      .optional(),
  }
);

export type FindAllAvailableSubscriptionPlansByPlanIdInputDto = z.infer<
  typeof FindAllAvailableSubscriptionPlansByPlanIdInputDtoSchema
>;

export type FindAllAvailableSubscriptionPlansByPlanIdOutputDto = {
  plan: SubscriptionPlan;
  availablePlans: SubscriptionPlan[];
  frequencyPaths: SubscriptionPlanPathDto;
  familyPaths: SubscriptionPlanPathDto;
  pricePaths: SubscriptionPlanPathDto;
};

export type FindAllAvailableSubscriptionPlansByPlanIdErrorDto =
  BusinessResultInputContextErrorDto<FindAllAvailableSubscriptionPlansByPlanIdInputDto>;

// -----------------------------------------------------------------
// Cancel Provider Subscription At Period End
// -----------------------------------------------------------------

export const CancelProviderSubscriptionAtPeriodEndInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type CancelProviderSubscriptionAtPeriodEndInputDto = z.infer<
  typeof CancelProviderSubscriptionAtPeriodEndInputDtoSchema
>;

export type CancelProviderSubscriptionAtPeriodEndOutputDto = {
  provider: ProviderSubscription;
};

export type CancelProviderSubscriptionAtPeriodEndErrorDto =
  BusinessResultInputContextErrorDto<CancelProviderSubscriptionAtPeriodEndInputDto>;

// -----------------------------------------------------------------
// Cancel Subscription At Period End
// -----------------------------------------------------------------

export const CancelSubscriptionAtPeriodEndInputDtoSchema = z.object({
  subscriptionId: z.string(),
});

export type CancelSubscriptionAtPeriodEndInputDto = z.infer<
  typeof CancelSubscriptionAtPeriodEndInputDtoSchema
>;

export type CancelSubscriptionAtPeriodEndOutputDto = {
  connection: SubscriptionConnectionEntity;
  provider: ProviderSubscription;
};

export type CancelSubscriptionAtPeriodEndErrorDto =
  BusinessResultInputContextErrorDto<CancelSubscriptionAtPeriodEndInputDto>;

// -----------------------------------------------------------------
// Resume Cancelled Provider Subscription
// -----------------------------------------------------------------

export const ResumeCancelledProviderSubscriptionInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerId: z.string(),
});

export type ResumeCancelledProviderSubscriptionInputDto = z.infer<
  typeof ResumeCancelledProviderSubscriptionInputDtoSchema
>;

export type ResumeCancelledProviderSubscriptionOutputDto = {
  provider: ProviderSubscription;
};

export type ResumeCancelledProviderSubscriptionErrorDto =
  BusinessResultInputContextErrorDto<ResumeCancelledProviderSubscriptionInputDto>;

// -----------------------------------------------------------------
// Resume Cancelled Subscription
// -----------------------------------------------------------------

export const ResumeCancelledSubscriptionInputDtoSchema = z.object({
  subscriptionId: z.string(),
});

export type ResumeCancelledSubscriptionInputDto = z.infer<
  typeof ResumeCancelledSubscriptionInputDtoSchema
>;

export type ResumeCancelledSubscriptionOutputDto = {
  connection: SubscriptionConnectionEntity;
  provider: ProviderSubscription;
};

export type ResumeCancelledSubscriptionErrorDto =
  BusinessResultInputContextErrorDto<ResumeCancelledSubscriptionInputDto>;

// -----------------------------------------------------------------
// Create Provider Payment Method Management Session
// -----------------------------------------------------------------

export const CreateProviderPaymentMethodManagementSessionInputDtoSchema =
  z.object({
    provider: z.nativeEnum(BILLING_PROVIDER),
    providerCustomerId: z.string(),
    returnUrl: z.string().url(),
  });

export type CreateProviderPaymentMethodManagementSessionInputDto = z.infer<
  typeof CreateProviderPaymentMethodManagementSessionInputDtoSchema
>;

export type CreateProviderPaymentMethodManagementSessionOutputDto = {
  session: ProviderBillingManagementSession;
};

export type CreateProviderPaymentMethodManagementSessionErrorDto =
  BusinessResultInputContextErrorDto<CreateProviderPaymentMethodManagementSessionInputDto>;

// -----------------------------------------------------------------
// Create Customer Payment Method Management Session
// -----------------------------------------------------------------

export const CreateCustomerPaymentMethodManagementSessionInputDtoSchema =
  z.object({
    customerId: z.string(),
    returnUrl: z.string().url(),
  });

export type CreateCustomerPaymentMethodManagementSessionInputDto = z.infer<
  typeof CreateCustomerPaymentMethodManagementSessionInputDtoSchema
>;

export type CreateCustomerPaymentMethodManagementSessionOutputDto = {
  session: ProviderBillingManagementSession;
};

export type CreateCustomerPaymentMethodManagementSessionErrorDto =
  BusinessResultInputContextErrorDto<CreateCustomerPaymentMethodManagementSessionInputDto>;

// -----------------------------------------------------------------
// Update Provider Subscription Item Price
// -----------------------------------------------------------------

export const UpdateProviderSubscriptionItemPriceInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerSubscriptionId: z.string(),
  providerSubscriptionItemId: z.string(),
  providerPriceId: z.string(),
  quantity: z.number().int().positive(),
  prorate: z.boolean(),
  chargeImmediately: z.boolean(),
  resetBillingCycle: z.boolean(),
});

export type UpdateProviderSubscriptionItemPriceInputDto = z.infer<
  typeof UpdateProviderSubscriptionItemPriceInputDtoSchema
>;

export type UpdateProviderSubscriptionItemPriceOutputDto = {
  provider: ProviderSubscriptionItem;
};

export type UpdateProviderSubscriptionItemPriceErrorDto =
  BusinessResultInputContextErrorDto<UpdateProviderSubscriptionItemPriceInputDto>;

// -----------------------------------------------------------------
// Update Subscription Item Price
// -----------------------------------------------------------------

export const UpdateSubscriptionItemPriceInputDtoSchema = z.object({
  subscriptionItemId: z.string(),
  priceId: z.string(),
  quantity: z.number().int().positive(),
  prorate: z.boolean(),
  chargeImmediately: z.boolean(),
  resetBillingCycle: z.boolean(),
});

export type UpdateSubscriptionItemPriceInputDto = z.infer<
  typeof UpdateSubscriptionItemPriceInputDtoSchema
>;

export type UpdateSubscriptionItemPriceOutputDto = {
  connection: SubscriptionItemConnectionEntity;
  provider: ProviderSubscriptionItem;
};

export type UpdateSubscriptionItemPriceErrorDto =
  BusinessResultInputContextErrorDto<UpdateSubscriptionItemPriceInputDto>;

// -----------------------------------------------------------------
// Preview Subscription Item Price Change
// -----------------------------------------------------------------

export const PreviewProviderSubscriptionItemPriceChangeInputDtoSchema =
  z.object({
    provider: z.nativeEnum(BILLING_PROVIDER),
    providerSubscriptionId: z.string(),
    providerSubscriptionItemId: z.string(),
    providerPriceId: z.string(),
    quantity: z.number().int().positive(),
    prorate: z.boolean(),
    chargeImmediately: z.boolean(),
    resetBillingCycle: z.boolean(),
  });

export type PreviewProviderSubscriptionItemPriceChangeInputDto = z.infer<
  typeof PreviewProviderSubscriptionItemPriceChangeInputDtoSchema
>;

export type PreviewProviderSubscriptionItemPriceChangeOutputDto = {
  provider: ProviderInvoice;
};

export type PreviewProviderSubscriptionItemPriceChangeErrorDto =
  BusinessResultInputContextErrorDto<PreviewProviderSubscriptionItemPriceChangeInputDto>;

// -----------------------------------------------------------------
// Cursor Paginate Provider Customer Invoices
// -----------------------------------------------------------------

export const CursorPaginateProviderCustomerInvoicesInputDtoSchema = z.object({
  provider: z.nativeEnum(BILLING_PROVIDER),
  providerCustomerId: z.string(),
  pagination: CursorPaginationInputDtoSchema,
  filter: BillingProviderInvoiceFilterSchema.optional(),
});

export type CursorPaginateProviderCustomerInvoicesInputDto = z.infer<
  typeof CursorPaginateProviderCustomerInvoicesInputDtoSchema
>;

export type CursorPaginateProviderCustomerInvoicesOutputDto =
  CursorPaginationOutputDto<ProviderInvoice>;

export type CursorPaginateProviderCustomerInvoicesErrorDto =
  BusinessResultInputContextErrorDto<CursorPaginateProviderCustomerInvoicesInputDto>;

// -----------------------------------------------------------------
// Change Subscription Plan
// -----------------------------------------------------------------

export const ChangeSubscriptionPlanInputDtoSchema = z.object({
  subscriptionItemId: z.string(),
  fromPlanId: z.string(),
  toPlanId: z.string(),
  quantity: z.number().int().positive(),
});

export type ChangeSubscriptionPlanInputDto = z.infer<
  typeof ChangeSubscriptionPlanInputDtoSchema
>;

export type ChangeSubscriptionPlanOutputDto = {
  plan: SubscriptionPlan;
  subscriptionItemConnection: SubscriptionItemConnectionEntity;
};

export type ChangeSubscriptionPlanErrorDto =
  BusinessResultInputContextErrorDto<ChangeSubscriptionPlanInputDto>;

// -----------------------------------------------------------------
// Find Subscription Item Connection by ID
// -----------------------------------------------------------------

export const FindSubscriptionItemConnectionByIdInputDtoSchema = z.object({
  subscriptionItemId: z.string(),
});

export type FindSubscriptionItemConnectionByIdInputDto = z.infer<
  typeof FindSubscriptionItemConnectionByIdInputDtoSchema
>;

export type FindSubscriptionItemConnectionByIdOutputDto = {
  connection: SubscriptionItemConnectionEntity;
};

export type FindSubscriptionItemConnectionByIdErrorDto =
  BusinessResultInputContextErrorDto<FindSubscriptionItemConnectionByIdInputDto>;
