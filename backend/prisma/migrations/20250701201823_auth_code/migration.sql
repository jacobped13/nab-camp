-- CreateTable
CREATE TABLE "authenticationCode" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "expireAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_authentication_code_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_authentication_code_targetId_targetType_codeHash" ON "authenticationCode"("targetId", "targetType", "codeHash");
