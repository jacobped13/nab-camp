-- CreateTable
CREATE TABLE "userDefaultWorkspace" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_user_default_workspace_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_user_default_workspace_userId" ON "userDefaultWorkspace"("userId");

-- AddForeignKey
ALTER TABLE "userDefaultWorkspace" ADD CONSTRAINT "fk_user_default_workspace_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userDefaultWorkspace" ADD CONSTRAINT "fk_user_default_workspace_workspaceId" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
