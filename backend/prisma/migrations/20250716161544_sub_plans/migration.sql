-- CreateTable
CREATE TABLE "subscriptionPlanFamily" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "productId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "setupType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_sub_plan_family_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionPlanFamilyFeature" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "familyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_sub_plan_family_feature_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionPlan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "priceId" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "frequency" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_sub_plan_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionPlanFamilyGroup" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_sub_plan_family_group_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionPlanFamilyGroupItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "groupId" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_sub_plan_family_group_item_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionPlanFamilyGroupPath" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "groupId" UUID NOT NULL,
    "fromItemId" UUID NOT NULL,
    "toItemId" UUID NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_sub_plan_family_group_path_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_sub_plan_family_key" ON "subscriptionPlanFamily"("key");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_sub_plan_family_feature_familyId_order" ON "subscriptionPlanFamilyFeature"("familyId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_sub_plan_priceId" ON "subscriptionPlan"("priceId");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_sub_plan_familyId_frequency" ON "subscriptionPlan"("familyId", "frequency");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_sub_plan_family_group_key" ON "subscriptionPlanFamilyGroup"("key");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_sub_plan_family_group_item_familyId" ON "subscriptionPlanFamilyGroupItem"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_sub_plan_family_group_item_groupId_order" ON "subscriptionPlanFamilyGroupItem"("groupId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_sub_plan_family_group_path_groupId_fromItemId_toItemId" ON "subscriptionPlanFamilyGroupPath"("groupId", "fromItemId", "toItemId");

-- AddForeignKey
ALTER TABLE "subscriptionPlanFamily" ADD CONSTRAINT "subscriptionPlanFamily_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionPlanFamilyFeature" ADD CONSTRAINT "fk_sub_plan_family_feature_familyId" FOREIGN KEY ("familyId") REFERENCES "subscriptionPlanFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionPlan" ADD CONSTRAINT "fk_sub_plan_familyId" FOREIGN KEY ("familyId") REFERENCES "subscriptionPlanFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionPlan" ADD CONSTRAINT "subscriptionPlan_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionPlanFamilyGroupItem" ADD CONSTRAINT "fk_sub_plan_family_group_item_groupId" FOREIGN KEY ("groupId") REFERENCES "subscriptionPlanFamilyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionPlanFamilyGroupItem" ADD CONSTRAINT "fk_sub_plan_family_group_item_familyId" FOREIGN KEY ("familyId") REFERENCES "subscriptionPlanFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionPlanFamilyGroupPath" ADD CONSTRAINT "fk_sub_plan_family_group_path_groupId" FOREIGN KEY ("groupId") REFERENCES "subscriptionPlanFamilyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionPlanFamilyGroupPath" ADD CONSTRAINT "fk_sub_plan_family_group_path_fromItemId" FOREIGN KEY ("fromItemId") REFERENCES "subscriptionPlanFamilyGroupItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptionPlanFamilyGroupPath" ADD CONSTRAINT "fk_sub_plan_family_group_path_toItemId" FOREIGN KEY ("toItemId") REFERENCES "subscriptionPlanFamilyGroupItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
