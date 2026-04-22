/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider]` on the table `userIdentityProvider` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `userIdentityProvider` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `workspaceId` on the `workspaceMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `workspaceMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "idx_user_idp_userId";

-- AlterTable
ALTER TABLE "resourceStakeholderRole" RENAME CONSTRAINT "pk_resource_stakeholder_role_id" TO "pk_rsr_id";

-- AlterTable
ALTER TABLE "userIdentityProvider" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "workspaceMember" DROP COLUMN "workspaceId",
ADD COLUMN     "workspaceId" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "uidx_user_idp_userId_provider" ON "userIdentityProvider"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_workspace_member_workspaceId_userId" ON "workspaceMember"("workspaceId", "userId");

-- AddForeignKey
ALTER TABLE "userIdentityProvider" ADD CONSTRAINT "fk_user_idp_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermission" ADD CONSTRAINT "fk_role_permission_roleName" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermission" ADD CONSTRAINT "fk_role_permission_permissionName" FOREIGN KEY ("permissionName") REFERENCES "permission"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resourceStakeholderRole" ADD CONSTRAINT "fk_rsr_roleName" FOREIGN KEY ("roleName") REFERENCES "role"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaceMember" ADD CONSTRAINT "fk_workspace_member_workspaceId" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "uidx_stakeholder_role_stkId_stkType_resId_resType_roleName" RENAME TO "uidx_rsr_stkId_stkType_resId_resType_roleName";
