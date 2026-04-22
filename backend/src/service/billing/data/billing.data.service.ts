import { Nullable } from '@common';
import { prisma } from '@lib/provider/database/prisma/prisma.service';
import {
  BILLING_PROVIDER,
  BILLING_PROVIDER_PRICE_STATUS,
  BILLING_PROVIDER_PRODUCT_STATUS,
  BILLING_PROVIDER_STAKEHOLDER_TYPE,
  BILLING_PROVIDER_SUBSCRIPTION_STATUS,
  SUBSCRIPTION_PLAN_SETUP_TYPE,
  SUBSCRIPTION_PLAN_TYPE,
} from '../common/billing.constant';
import {
  mapBillingProviderEventLogEntity,
  mapCustomerConnectionEntity,
  mapPriceConnectionEntity,
  mapProductConnectionEntity,
  mapSubscriptionConnectionEntity,
  mapSubscriptionItemConnectionEntity,
  mapSubscriptionPlanFamilyEntity,
  mapSubscriptionPlanFamilyFeatureEntity,
  mapSubscriptionPlanEntity,
  mapSubscriptionPlanFamilyGroupEntity,
  mapSubscriptionPlanFamilyGroupItemEntity,
  mapSubscriptionPlanFamilyGroupPathEntity,
} from './helper/billing.data.util';
import {
  BillingProviderEventLogEntity,
  CustomerConnectionEntity,
  PriceConnectionEntity,
  ProductConnectionEntity,
  SubscriptionConnectionEntity,
  SubscriptionItemConnectionEntity,
  SubscriptionPlanFamilyEntity,
  SubscriptionPlanFamilyFeatureEntity,
  SubscriptionPlanEntity,
  SubscriptionPlanFamilyGroupEntity,
  SubscriptionPlanFamilyGroupItemEntity,
  SubscriptionPlanFamilyGroupPathEntity,
} from './helper/billing.data.model';
import { validateLatestBillingProviderResourceVersion } from '../common/billing.util';
import { SubscriptionPlanAggregate } from './helper/billing.data.dto';

export const createCustomerConnection = async (
  provider: BILLING_PROVIDER,
  providerId: string,
  stakeholderType: BILLING_PROVIDER_STAKEHOLDER_TYPE,
  stakeholderId: string
): Promise<CustomerConnectionEntity> => {
  const currentDate = new Date();

  return mapCustomerConnectionEntity(
    await prisma.customer.create({
      data: {
        provider: provider,
        providerId: providerId,
        stakeholderId: stakeholderId,
        stakeholderType: stakeholderType,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as CustomerConnectionEntity;
};

export const findCustomerConnectionById = async (
  id: string
): Promise<Nullable<CustomerConnectionEntity>> => {
  return mapCustomerConnectionEntity(
    await prisma.customer.findUnique({
      where: {
        id: id,
      },
    })
  ) as Nullable<CustomerConnectionEntity>;
};

export const findCustomerConnectionByStakeholder = async (
  stakeholderType: BILLING_PROVIDER_STAKEHOLDER_TYPE,
  stakeholderId: string
): Promise<Nullable<CustomerConnectionEntity>> => {
  return mapCustomerConnectionEntity(
    await prisma.customer.findUnique({
      where: {
        stakeholderType_stakeholderId: {
          stakeholderType: stakeholderType,
          stakeholderId: stakeholderId,
        },
      },
    })
  ) as Nullable<CustomerConnectionEntity>;
};

export const findAllCustomerConnectionsByStakeholders = async (
  stakeholders: {
    stakeholderId: string;
    stakeholderType: BILLING_PROVIDER_STAKEHOLDER_TYPE;
  }[]
): Promise<CustomerConnectionEntity[]> => {
  return mapCustomerConnectionEntity(
    await prisma.customer.findMany({
      where: {
        OR: stakeholders.map((stakeholder) => ({
          stakeholderType: stakeholder.stakeholderType,
          stakeholderId: stakeholder.stakeholderId,
        })),
      },
    })
  ) as CustomerConnectionEntity[];
};

export const findCustomerConnectionByProvider = async (
  provider: BILLING_PROVIDER,
  providerId: string
): Promise<Nullable<CustomerConnectionEntity>> => {
  return mapCustomerConnectionEntity(
    await prisma.customer.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    })
  ) as Nullable<CustomerConnectionEntity>;
};

export const findBillingProviderEventLogByProvider = async (
  provider: BILLING_PROVIDER,
  providerId: string
): Promise<Nullable<BillingProviderEventLogEntity>> => {
  return mapBillingProviderEventLogEntity(
    await prisma.billingProviderEventLog.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    })
  ) as Nullable<BillingProviderEventLogEntity>;
};

export const findOrCreateBillingProviderEventLog = async (
  provider: BILLING_PROVIDER,
  providerId: string,
  publishedAt: Date
): Promise<{
  created: boolean;
  billingProviderEventLog: BillingProviderEventLogEntity;
}> => {
  const currentDate = new Date();

  return await prisma.$transaction(async (tx) => {
    const existingEventEntity = await tx.billingProviderEventLog.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    });

    if (existingEventEntity) {
      return {
        created: false,
        billingProviderEventLog: mapBillingProviderEventLogEntity(
          existingEventEntity
        ) as BillingProviderEventLogEntity,
      };
    }

    const newEventEntity = await tx.billingProviderEventLog.create({
      data: {
        provider: provider,
        providerId: providerId,
        publishedAt: publishedAt,
        processedAt: null,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    return {
      created: true,
      billingProviderEventLog: mapBillingProviderEventLogEntity(
        newEventEntity
      ) as BillingProviderEventLogEntity,
    };
  });
};

export const createBillingProviderEventLog = async (
  provider: BILLING_PROVIDER,
  providerId: string,
  publishedAt: Date,
  processedAt: Nullable<Date>
): Promise<BillingProviderEventLogEntity> => {
  const currentDate = new Date();

  return mapBillingProviderEventLogEntity(
    await prisma.billingProviderEventLog.create({
      data: {
        provider: provider,
        providerId: providerId,
        processedAt: processedAt,
        publishedAt: publishedAt,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    })
  ) as BillingProviderEventLogEntity;
};

export const processBillingProviderEventLog = async (
  provider: BILLING_PROVIDER,
  providerId: string,
  processedAt: Date
): Promise<BillingProviderEventLogEntity> => {
  const currentDate = new Date();

  return mapBillingProviderEventLogEntity(
    await prisma.billingProviderEventLog.update({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
      data: {
        processedAt: processedAt,
        updatedAt: currentDate,
      },
    })
  ) as BillingProviderEventLogEntity;
};

export const deleteBillingProviderEventLog = async (
  provider: BILLING_PROVIDER,
  providerId: string
): Promise<BillingProviderEventLogEntity> => {
  return mapBillingProviderEventLogEntity(
    await prisma.billingProviderEventLog.delete({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    })
  ) as BillingProviderEventLogEntity;
};

export const findSubscriptionConnectionById = async (
  id: string
): Promise<Nullable<SubscriptionConnectionEntity>> => {
  return mapSubscriptionConnectionEntity(
    await prisma.subscription.findUnique({
      where: {
        id: id,
      },
    })
  ) as Nullable<SubscriptionConnectionEntity>;
};

export const findSubscriptionConnectionByProvider = async (
  provider: BILLING_PROVIDER,
  providerId: string
): Promise<Nullable<SubscriptionConnectionEntity>> => {
  return mapSubscriptionConnectionEntity(
    await prisma.subscription.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    })
  ) as Nullable<SubscriptionConnectionEntity>;
};

export const findAllSubscriptionConnectionsByCustomerIds = async (
  customerIds: string[],
  statuses?: BILLING_PROVIDER_SUBSCRIPTION_STATUS[]
): Promise<SubscriptionConnectionEntity[]> => {
  return mapSubscriptionConnectionEntity(
    await prisma.subscription.findMany({
      where: {
        customerId: {
          in: customerIds,
        },
        status: {
          in: statuses,
        },
      },
    })
  ) as SubscriptionConnectionEntity[];
};

export const findOrCreateSubscriptionConnection = async (
  provider: BILLING_PROVIDER,
  providerId: string,
  providerVersion: Nullable<string>,
  customerId: string,
  status: BILLING_PROVIDER_SUBSCRIPTION_STATUS,
  cancelAt: Nullable<Date>
): Promise<{
  created: boolean;
  subscriptionConnection: SubscriptionConnectionEntity;
}> => {
  const currentDate = new Date();

  return await prisma.$transaction(async (tx) => {
    const existingConnection = await tx.subscription.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    });

    if (existingConnection) {
      return {
        created: false,
        subscriptionConnection: mapSubscriptionConnectionEntity(
          existingConnection
        ) as SubscriptionConnectionEntity,
      };
    }

    const newConnection = await tx.subscription.create({
      data: {
        provider: provider,
        providerId: providerId,
        customerId: customerId,
        status: status,
        providerVersion: providerVersion,
        cancelAt: cancelAt,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    return {
      created: true,
      subscriptionConnection: mapSubscriptionConnectionEntity(
        newConnection
      ) as SubscriptionConnectionEntity,
    };
  });
};

export const updateLatestSubscriptionConnection = async (
  id: string,
  providerVersion: string,
  status?: BILLING_PROVIDER_SUBSCRIPTION_STATUS,
  cancelAt?: Nullable<Date>
): Promise<Nullable<SubscriptionConnectionEntity>> => {
  const currentDate = new Date();

  return prisma.$transaction(async (tx) => {
    const existingConnectionEntity = mapSubscriptionConnectionEntity(
      await tx.subscription.findUnique({
        where: {
          id: id,
        },
      })
    ) as Nullable<SubscriptionConnectionEntity>;

    if (!existingConnectionEntity) {
      return null;
    }

    // Validate if the input version is the latest
    const isInputVersionLatest = validateLatestBillingProviderResourceVersion(
      existingConnectionEntity.provider,
      providerVersion,
      existingConnectionEntity.providerVersion || ''
    );

    if (!isInputVersionLatest) {
      return null;
    }

    return mapSubscriptionConnectionEntity(
      await tx.subscription.update({
        where: {
          id: id,
        },
        data: {
          providerVersion: providerVersion,
          status: status,
          cancelAt: cancelAt,
          updatedAt: currentDate,
        },
      })
    ) as SubscriptionConnectionEntity;
  });
};

export const deleteAllSubscriptionConnectionsByCustomerIdAndStatuses = async (
  customerId: string,
  statuses: BILLING_PROVIDER_SUBSCRIPTION_STATUS[]
): Promise<SubscriptionConnectionEntity[]> => {
  return prisma.$transaction(async (tx) => {
    // Step 1: Find all the subscription connections that need to be deleted
    const connectionEntities = mapSubscriptionConnectionEntity(
      await tx.subscription.findMany({
        where: {
          customerId: customerId,
          status: {
            in: statuses,
          },
        },
      })
    ) as SubscriptionConnectionEntity[];

    // Step 2: Delete the subscription connections
    await tx.subscription.deleteMany({
      where: {
        id: {
          in: connectionEntities.map((entity) => entity.id),
        },
      },
    });

    return connectionEntities;
  });
};

export const findSubscriptionItemConnectionByProvider = async (
  provider: BILLING_PROVIDER,
  providerId: string
): Promise<Nullable<SubscriptionItemConnectionEntity>> => {
  return mapSubscriptionItemConnectionEntity(
    await prisma.subscriptionItem.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    })
  ) as Nullable<SubscriptionItemConnectionEntity>;
};

export const findSubscriptionItemConnectionById = async (
  id: string
): Promise<Nullable<SubscriptionItemConnectionEntity>> => {
  return mapSubscriptionItemConnectionEntity(
    await prisma.subscriptionItem.findUnique({
      where: {
        id: id,
      },
    })
  ) as Nullable<SubscriptionItemConnectionEntity>;
};

export const findAllSubscriptionItemConnectionsBySubscriptionId = async (
  subscriptionId: string
): Promise<SubscriptionItemConnectionEntity[]> => {
  return mapSubscriptionItemConnectionEntity(
    await prisma.subscriptionItem.findMany({
      where: {
        subscriptionId: subscriptionId,
      },
    })
  ) as SubscriptionItemConnectionEntity[];
};

export const findAllSubscriptionItemConnectionsBySubscriptionIds = async (
  subscriptionIds: string[]
): Promise<SubscriptionItemConnectionEntity[]> => {
  return mapSubscriptionItemConnectionEntity(
    await prisma.subscriptionItem.findMany({
      where: {
        subscriptionId: {
          in: subscriptionIds,
        },
      },
    })
  ) as SubscriptionItemConnectionEntity[];
};

export const findOrCreateSubscriptionItemConnection = async (
  provider: BILLING_PROVIDER,
  providerId: string,
  providerVersion: Nullable<string>,
  subscriptionId: string,
  priceId: string,
  quantity: number,
  currentPeriodStartAt: Date,
  currentPeriodEndAt: Date
): Promise<{
  created: boolean;
  subscriptionItemConnection: SubscriptionItemConnectionEntity;
}> => {
  const currentDate = new Date();

  return await prisma.$transaction(async (tx) => {
    const existingConnection = await tx.subscriptionItem.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    });

    if (existingConnection) {
      return {
        created: false,
        subscriptionItemConnection: mapSubscriptionItemConnectionEntity(
          existingConnection
        ) as SubscriptionItemConnectionEntity,
      };
    }

    const newConnection = await tx.subscriptionItem.create({
      data: {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        subscriptionId: subscriptionId,
        priceId: priceId,
        quantity: quantity,
        currentPeriodStartAt: currentPeriodStartAt,
        currentPeriodEndAt: currentPeriodEndAt,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    return {
      created: true,
      subscriptionItemConnection: mapSubscriptionItemConnectionEntity(
        newConnection
      ) as SubscriptionItemConnectionEntity,
    };
  });
};

export const updateLatestSubscriptionItemConnection = async (
  id: string,
  providerVersion: string,
  priceId?: string,
  quantity?: number,
  currentPeriodStartAt?: Date,
  currentPeriodEndAt?: Date
): Promise<Nullable<SubscriptionItemConnectionEntity>> => {
  const currentDate = new Date();

  return prisma.$transaction(async (tx) => {
    const existingConnectionEntity = mapSubscriptionItemConnectionEntity(
      await tx.subscriptionItem.findUnique({
        where: {
          id: id,
        },
      })
    ) as Nullable<SubscriptionItemConnectionEntity>;

    if (!existingConnectionEntity) {
      return null;
    }

    // Validate if the input version is the latest
    const isInputVersionLatest = validateLatestBillingProviderResourceVersion(
      existingConnectionEntity.provider,
      providerVersion,
      existingConnectionEntity.providerVersion || ''
    );

    if (!isInputVersionLatest) {
      return null;
    }

    return mapSubscriptionItemConnectionEntity(
      await tx.subscriptionItem.update({
        where: {
          id: id,
        },
        data: {
          providerVersion: providerVersion,
          priceId: priceId,
          quantity: quantity,
          currentPeriodStartAt: currentPeriodStartAt,
          currentPeriodEndAt: currentPeriodEndAt,
          updatedAt: currentDate,
        },
      })
    ) as SubscriptionItemConnectionEntity;
  });
};

export const deleteSubscriptionItemConnections = async (
  subscriptionItemIds: string[]
): Promise<SubscriptionItemConnectionEntity[]> => {
  return prisma.$transaction(async (tx) => {
    // Step 1: Find all the subscription item connections that need to be deleted
    const connectionEntities = mapSubscriptionItemConnectionEntity(
      await tx.subscriptionItem.findMany({
        where: {
          id: {
            in: subscriptionItemIds,
          },
        },
      })
    ) as SubscriptionItemConnectionEntity[];

    // Step 2: Delete the subscription item connections
    await tx.subscriptionItem.deleteMany({
      where: {
        id: {
          in: subscriptionItemIds,
        },
      },
    });

    return connectionEntities;
  });
};

export const findProductConnectionByProvider = async (
  provider: BILLING_PROVIDER,
  providerId: string
): Promise<Nullable<ProductConnectionEntity>> => {
  return mapProductConnectionEntity(
    await prisma.product.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    })
  ) as Nullable<ProductConnectionEntity>;
};

export const findOrCreateProductConnection = async (
  provider: BILLING_PROVIDER,
  providerId: string,
  providerVersion: Nullable<string>,
  status: BILLING_PROVIDER_PRODUCT_STATUS
): Promise<{
  created: boolean;
  productConnection: ProductConnectionEntity;
}> => {
  const currentDate = new Date();

  return await prisma.$transaction(async (tx) => {
    const existingConnection = await tx.product.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    });

    if (existingConnection) {
      return {
        created: false,
        productConnection: mapProductConnectionEntity(
          existingConnection
        ) as ProductConnectionEntity,
      };
    }

    const newConnection = await tx.product.create({
      data: {
        provider: provider,
        providerId: providerId,
        providerVersion: providerVersion,
        status: status,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    return {
      created: true,
      productConnection: mapProductConnectionEntity(
        newConnection
      ) as ProductConnectionEntity,
    };
  });
};

export const updateLatestProductConnection = async (
  id: string,
  providerVersion: string,
  status?: BILLING_PROVIDER_PRODUCT_STATUS
): Promise<Nullable<ProductConnectionEntity>> => {
  const currentDate = new Date();

  return prisma.$transaction(async (tx) => {
    const existingConnectionEntity = mapProductConnectionEntity(
      await tx.product.findUnique({
        where: {
          id: id,
        },
      })
    ) as Nullable<ProductConnectionEntity>;

    if (!existingConnectionEntity) {
      return null;
    }

    // Validate if the input version is the latest
    const isInputVersionLatest = validateLatestBillingProviderResourceVersion(
      existingConnectionEntity.provider,
      providerVersion,
      existingConnectionEntity.providerVersion || ''
    );

    if (!isInputVersionLatest) {
      return null;
    }

    return mapProductConnectionEntity(
      await tx.product.update({
        where: {
          id: id,
        },
        data: {
          providerVersion: providerVersion,
          status: status,
          updatedAt: currentDate,
        },
      })
    ) as ProductConnectionEntity;
  });
};

export const deleteProductConnection = async (
  productId: string
): Promise<ProductConnectionEntity> => {
  return mapProductConnectionEntity(
    await prisma.product.delete({
      where: {
        id: productId,
      },
    })
  ) as ProductConnectionEntity;
};

export const findAllPriceConnectionsByIds = async (
  priceIds: string[]
): Promise<PriceConnectionEntity[]> => {
  return mapPriceConnectionEntity(
    await prisma.price.findMany({
      where: {
        id: {
          in: priceIds,
        },
      },
    })
  ) as PriceConnectionEntity[];
};

export const findPriceConnectionById = async (
  priceId: string
): Promise<Nullable<PriceConnectionEntity>> => {
  return mapPriceConnectionEntity(
    await prisma.price.findUnique({
      where: {
        id: priceId,
      },
    })
  ) as Nullable<PriceConnectionEntity>;
};

export const findPriceConnectionByProvider = async (
  provider: BILLING_PROVIDER,
  providerId: string
): Promise<Nullable<PriceConnectionEntity>> => {
  return mapPriceConnectionEntity(
    await prisma.price.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    })
  ) as Nullable<PriceConnectionEntity>;
};

export const findOrCreatePriceConnection = async (
  provider: BILLING_PROVIDER,
  providerId: string,
  providerVersion: Nullable<string>,
  productId: string,
  unitAmount: Nullable<number>,
  status: BILLING_PROVIDER_PRICE_STATUS
): Promise<{
  created: boolean;
  priceConnection: PriceConnectionEntity;
}> => {
  const currentDate = new Date();

  return await prisma.$transaction(async (tx) => {
    const existingConnection = await tx.price.findUnique({
      where: {
        provider_providerId: {
          provider: provider,
          providerId: providerId,
        },
      },
    });

    if (existingConnection) {
      return {
        created: false,
        priceConnection: mapPriceConnectionEntity(
          existingConnection
        ) as PriceConnectionEntity,
      };
    }

    const newConnection = await tx.price.create({
      data: {
        provider: provider,
        providerId: providerId,
        productId: productId,
        unitAmount: unitAmount,
        status: status,
        providerVersion: providerVersion,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });

    return {
      created: true,
      priceConnection: mapPriceConnectionEntity(
        newConnection
      ) as PriceConnectionEntity,
    };
  });
};

export const updateLatestPriceConnection = async (
  id: string,
  providerVersion: string,
  status?: BILLING_PROVIDER_PRICE_STATUS,
  unitAmount?: Nullable<number>
): Promise<Nullable<PriceConnectionEntity>> => {
  const currentDate = new Date();

  return prisma.$transaction(async (tx) => {
    const existingConnectionEntity = mapPriceConnectionEntity(
      await tx.price.findUnique({
        where: {
          id: id,
        },
      })
    ) as Nullable<PriceConnectionEntity>;

    if (!existingConnectionEntity) {
      return null;
    }

    // Validate if the input version is the latest
    const isInputVersionLatest = validateLatestBillingProviderResourceVersion(
      existingConnectionEntity.provider,
      providerVersion,
      existingConnectionEntity.providerVersion || ''
    );

    if (!isInputVersionLatest) {
      return null;
    }

    return mapPriceConnectionEntity(
      await tx.price.update({
        where: {
          id: id,
        },
        data: {
          providerVersion: providerVersion,
          status: status,
          unitAmount: unitAmount,
          updatedAt: currentDate,
        },
      })
    ) as PriceConnectionEntity;
  });
};

export const deletePriceConnection = async (
  priceId: string
): Promise<PriceConnectionEntity> => {
  return mapPriceConnectionEntity(
    await prisma.price.delete({
      where: {
        id: priceId,
      },
    })
  ) as PriceConnectionEntity;
};

export const findSubscriptionPlanById = async (
  id: string
): Promise<Nullable<SubscriptionPlanEntity>> => {
  return mapSubscriptionPlanEntity(
    await prisma.subscriptionPlan.findUnique({
      where: {
        id: id,
      },
    })
  ) as Nullable<SubscriptionPlanEntity>;
};

export const findAllSubscriptionPlansByPriceIds = async (
  priceIds: string[]
): Promise<SubscriptionPlanEntity[]> => {
  return mapSubscriptionPlanEntity(
    await prisma.subscriptionPlan.findMany({
      where: {
        priceId: {
          in: priceIds,
        },
      },
    })
  ) as SubscriptionPlanEntity[];
};

export const findSubscriptionPlanAggregateById = async (
  id: string
): Promise<Nullable<SubscriptionPlanAggregate>> => {
  const operationResult = await prisma.subscriptionPlan.findUnique({
    where: {
      id: id,
    },
    include: {
      price: true,
      family: {
        include: {
          features: true,
        },
      },
    },
  });

  if (!operationResult) {
    return null;
  }

  return {
    plan: mapSubscriptionPlanEntity(operationResult) as SubscriptionPlanEntity,
    price: mapPriceConnectionEntity(
      operationResult.price
    ) as PriceConnectionEntity,
    family: mapSubscriptionPlanFamilyEntity(
      operationResult.family
    ) as SubscriptionPlanFamilyEntity,
    familyFeatures: mapSubscriptionPlanFamilyFeatureEntity(
      operationResult.family.features
    ) as SubscriptionPlanFamilyFeatureEntity[],
  };
};

export const findAllSubscriptionPlanAggregatesByFamilyIds = async (
  familyIds: string[],
  familyTypes?: SUBSCRIPTION_PLAN_TYPE[],
  familySetupTypes?: SUBSCRIPTION_PLAN_SETUP_TYPE[]
): Promise<SubscriptionPlanAggregate[]> => {
  const operationResults = await prisma.subscriptionPlan.findMany({
    where: {
      familyId: {
        in: familyIds,
      },
      family: {
        type: {
          in: familyTypes,
        },
        setupType: {
          in: familySetupTypes,
        },
      },
    },
    include: {
      price: true,
      family: {
        include: {
          features: true,
        },
      },
    },
  });

  return operationResults.map((operationResult) => ({
    plan: mapSubscriptionPlanEntity(operationResult) as SubscriptionPlanEntity,
    price: mapPriceConnectionEntity(
      operationResult.price
    ) as PriceConnectionEntity,
    family: mapSubscriptionPlanFamilyEntity(
      operationResult.family
    ) as SubscriptionPlanFamilyEntity,
    familyFeatures: mapSubscriptionPlanFamilyFeatureEntity(
      operationResult.family.features
    ) as SubscriptionPlanFamilyFeatureEntity[],
  }));
};

export const findAllSubscriptionPlanAggregatesByPriceIds = async (
  priceIds: string[],
  familyTypes?: SUBSCRIPTION_PLAN_TYPE[],
  familySetupTypes?: SUBSCRIPTION_PLAN_SETUP_TYPE[]
): Promise<SubscriptionPlanAggregate[]> => {
  const operationResults = await prisma.subscriptionPlan.findMany({
    where: {
      priceId: {
        in: priceIds,
      },
      family: {
        type: {
          in: familyTypes,
        },
        setupType: {
          in: familySetupTypes,
        },
      },
    },
    include: {
      price: true,
      family: {
        include: {
          features: true,
        },
      },
    },
  });

  return operationResults.map((operationResult) => ({
    plan: mapSubscriptionPlanEntity(operationResult) as SubscriptionPlanEntity,
    price: mapPriceConnectionEntity(
      operationResult.price
    ) as PriceConnectionEntity,
    family: mapSubscriptionPlanFamilyEntity(
      operationResult.family
    ) as SubscriptionPlanFamilyEntity,
    familyFeatures: mapSubscriptionPlanFamilyFeatureEntity(
      operationResult.family.features
    ) as SubscriptionPlanFamilyFeatureEntity[],
  }));
};

export const findAllSubscriptionPlansByFamilyIds = async (
  familyIds: string[]
): Promise<SubscriptionPlanEntity[]> => {
  return mapSubscriptionPlanEntity(
    await prisma.subscriptionPlan.findMany({
      where: {
        familyId: {
          in: familyIds,
        },
      },
    })
  ) as SubscriptionPlanEntity[];
};

export const findSubscriptionPlanFamilyGroupByKey = async (
  groupKey: string
): Promise<Nullable<SubscriptionPlanFamilyGroupEntity>> => {
  return mapSubscriptionPlanFamilyGroupEntity(
    await prisma.subscriptionPlanFamilyGroup.findUnique({
      where: {
        key: groupKey,
      },
    })
  ) as Nullable<SubscriptionPlanFamilyGroupEntity>;
};

export const findAllSubscriptionPlanFamilyGroupItemsByGroupId = async (
  groupId: string
): Promise<SubscriptionPlanFamilyGroupItemEntity[]> => {
  return mapSubscriptionPlanFamilyGroupItemEntity(
    await prisma.subscriptionPlanFamilyGroupItem.findMany({
      where: {
        groupId: groupId,
      },
    })
  ) as SubscriptionPlanFamilyGroupItemEntity[];
};

export const findSubscriptionPlanFamilyGroupItemByFamilyId = async (
  familyId: string
): Promise<Nullable<SubscriptionPlanFamilyGroupItemEntity>> => {
  return mapSubscriptionPlanFamilyGroupItemEntity(
    await prisma.subscriptionPlanFamilyGroupItem.findUnique({
      where: {
        familyId: familyId,
      },
    })
  ) as Nullable<SubscriptionPlanFamilyGroupItemEntity>;
};

export const findAllSubscriptionPlanFamilyGroupItemsByIds = async (
  groupItemIds: string[]
): Promise<SubscriptionPlanFamilyGroupItemEntity[]> => {
  return mapSubscriptionPlanFamilyGroupItemEntity(
    await prisma.subscriptionPlanFamilyGroupItem.findMany({
      where: {
        id: {
          in: groupItemIds,
        },
      },
    })
  ) as SubscriptionPlanFamilyGroupItemEntity[];
};

export const findAllSubscriptionPlanFamilyGroupPathsByFromItemId = async (
  fromItemId: string
): Promise<SubscriptionPlanFamilyGroupPathEntity[]> => {
  return mapSubscriptionPlanFamilyGroupPathEntity(
    await prisma.subscriptionPlanFamilyGroupPath.findMany({
      where: {
        fromItemId: fromItemId,
      },
    })
  ) as SubscriptionPlanFamilyGroupPathEntity[];
};
