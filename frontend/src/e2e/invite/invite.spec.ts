import { test } from "@playwright/test";

import { AuthHelper } from "@/e2e/auth/auth";
import { E2E_USERS } from "@/e2e/consts";
import { InviteHelper } from "@/e2e/invite/invite";
import { RegistrationHelper } from "@/e2e/registration/registration";

test.describe("Invite Flow", () => {
  test("send an invite and accept it", async ({ page }) => {
    const authHelper = new AuthHelper({
      page,
      email: E2E_USERS.InviteAdmin.email,
    });

    const registrationHelper = new RegistrationHelper({
      page,
      firstName: E2E_USERS.InviteAdmin.firstName,
      lastName: E2E_USERS.InviteAdmin.lastName,
      workspaceName: E2E_USERS.InviteAdmin.workspaceName,
      workspaceUrl: E2E_USERS.InviteAdmin.workspaceUrl,
    });

    await authHelper.authenticate();
    await registrationHelper.completeRegistration();

    const inviteAdmin = new InviteHelper({
      page,
      firstName: E2E_USERS.InviteAdmin.firstName,
      lastName: E2E_USERS.InviteAdmin.lastName,
      emailToInvite: E2E_USERS.InviteMember.email,
    });

    await inviteAdmin.inviteUser();

    const inviteMember = new InviteHelper({
      page,
      firstName: E2E_USERS.InviteMember.firstName,
      lastName: E2E_USERS.InviteMember.lastName,
      emailToInvite: E2E_USERS.InviteMember.email,
    });

    await inviteMember.acceptInvite();
  });
});
