-- CreateTable
CREATE TABLE "workspaceInvite" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspaceId" UUID NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "acceptedAt" TIMESTAMPTZ(6),
    "expireAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_workspace_invite_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_workspace_invite_hash" ON "workspaceInvite"("codeHash");

-- CreateIndex
CREATE UNIQUE INDEX "uidx_workspace_invite_wsId_targetId_targetType_codeHash" ON "workspaceInvite"("workspaceId", "targetId", "targetType", "codeHash");

-- AddForeignKey
ALTER TABLE "workspaceInvite" ADD CONSTRAINT "fk_workspace_invite_workspaceId" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
