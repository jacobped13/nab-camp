-- CreateTable
CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_user_id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uidx_user_email" ON "user"("email");
