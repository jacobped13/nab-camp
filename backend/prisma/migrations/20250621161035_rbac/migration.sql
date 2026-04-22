-- CreateTable
CREATE TABLE "permission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_permission_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_role_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rolePermission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "roleName" TEXT NOT NULL,
    "permissionName" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_role_permission_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resourceStakeholderRole" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stakeholderId" TEXT NOT NULL,
    "stakeholderType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_resource_stakeholder_role_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_workspace_id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaceMember" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_workspace_member_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_permission_name" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_role_name" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_role_permission_roleName_permissionName" ON "rolePermission"("roleName", "permissionName");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_stakeholder_role_stkId_stkType_resId_resType_roleName" ON "resourceStakeholderRole"("stakeholderId", "stakeholderType", "resourceId", "resourceType", "roleName");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_workspace_member_workspaceId_userId" ON "workspaceMember"("workspaceId", "userId");
