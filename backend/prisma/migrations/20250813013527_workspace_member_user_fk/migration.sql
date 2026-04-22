-- AddForeignKey
ALTER TABLE "workspaceMember" ADD CONSTRAINT "fk_workspace_member_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
