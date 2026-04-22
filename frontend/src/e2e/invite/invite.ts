import { expect, type Page } from "@playwright/test";

import { Routes } from "@/app/routes/routes";
import { AuthHelper } from "@/e2e/auth/auth";
import { DATA_TEST_IDS } from "@/e2e/consts";
import { RegistrationHelper } from "@/e2e/registration/registration";
import { PERSISTED_LOCAL_STORAGE_KEYS } from "@/lib/consts/local-storage-keys";

type InviteHelperArgs = {
  page: Page;
  firstName: string;
  lastName: string;
  emailToInvite: string;
};

export class InviteHelper {
  private page: Page;
  private firstName: string;
  private lastName: string;
  private emailToInvite: string;

  constructor({ page, firstName, lastName, emailToInvite }: InviteHelperArgs) {
    this.page = page;
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailToInvite = emailToInvite;
  }

  async inviteUser(): Promise<void> {
    this.page.goto(Routes.WorkspaceInvites);

    // Open the invite modal
    const openInviteModalButton = this.page.getByTestId(
      DATA_TEST_IDS.INVITE.OPEN_INVITE_MODAL_BUTTON,
    );
    await openInviteModalButton.click();

    // Fill out the invite form
    const inviteInput = this.page.getByTestId(
      DATA_TEST_IDS.INVITE.SEND_INVITES_INPUT,
    );
    await inviteInput.fill(this.emailToInvite);
    await inviteInput.press("Space");

    // Submit the invite form
    const submitButton = this.page.getByTestId(
      DATA_TEST_IDS.INVITE.SEND_INVITES_BUTTON,
    );
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // wait for modal to close
    await submitButton.waitFor({
      state: "detached",
    });

    await this.page.goto(Routes.Home);
    expect(this.page).toHaveURL(Routes.Home, { timeout: 5000 });
  }

  async acceptInvite(): Promise<void> {
    // Wait for the invite to be sent and stored in localStorage
    const inviteId = await this.page.evaluate(
      (key) => localStorage.getItem(key),
      PERSISTED_LOCAL_STORAGE_KEYS.DEVELOPMENT_INVITE_ID,
    );

    // Authenticate the new user after logging out
    const auth = new AuthHelper({
      page: this.page,
      email: this.emailToInvite,
      inviteId,
    });
    await auth.logout();
    await auth.authenticate();

    // Register the user
    const register = new RegistrationHelper({
      page: this.page,
      firstName: this.firstName,
      lastName: this.lastName,
      workspaceName: "",
      workspaceUrl: "",
    });

    await register.registerUser();

    // Click the accept invite button
    const acceptButton = this.page.getByTestId(
      DATA_TEST_IDS.INVITE.ACCEPT_BUTTON,
    );
    await expect(acceptButton).toBeEnabled({ timeout: 10_000 });
    await acceptButton.click();

    // Verify we are redirected to the root page
    await expect(this.page).toHaveURL(Routes.Home);
  }
}
