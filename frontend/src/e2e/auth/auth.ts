import { expect, type Page } from "@playwright/test";

import { Routes } from "@/app/routes/routes";
import { DATA_TEST_IDS } from "@/e2e/consts";
import {
  SEARCH_PARAM_MAPPING,
  SearchParamsKeys,
} from "@/hooks/use-search-params";

type AuthHelperArgs = {
  page: Page;
  email: string;
  inviteId?: string | null;
};

export class AuthHelper {
  private page: Page;
  private email: string;
  private inviteId: string;

  constructor({ page, email, inviteId }: AuthHelperArgs) {
    this.page = page;
    this.email = email;
    this.inviteId = inviteId ?? "";
  }

  async authenticate(): Promise<void> {
    await this.submitEmail();
    await this.verifyCode();
  }

  async submitEmail(): Promise<void> {
    // Navigate to login if not already there
    await (this.inviteId
      ? this.page.goto(
          `${Routes.AuthLogin}?${SEARCH_PARAM_MAPPING[SearchParamsKeys.InviteId].key}=${this.inviteId}`,
        )
      : this.page.goto(Routes.AuthLogin));

    // Fill out the email input and submit
    await this.page
      .getByTestId(DATA_TEST_IDS.AUTH.EMAIL_INPUT)
      .fill(this.email);
    await this.page.getByTestId(DATA_TEST_IDS.AUTH.EMAIL_SUBMIT_BUTTON).click();

    // Wait for redirect to code verification page
    await expect(this.page).toHaveURL(new RegExp(`${Routes.AuthVerifyCode}.*`));

    // Verify email is in URL params
    const url = new URL(this.page.url());
    const emailParam = url.searchParams.get("email");
    expect(emailParam).toBe(this.email);
  }

  async verifyCode(): Promise<void> {
    // Get code from URL params
    const url = new URL(this.page.url());
    const codeParam = url.searchParams.get("code");

    // Verify code input is visible and prefilled
    const codeInput = this.page.getByTestId(
      DATA_TEST_IDS.AUTH.VERIFY_CODE_INPUT,
    );
    await expect(codeInput).toBeVisible();

    const codeValue = await codeInput.inputValue();
    expect(codeValue).toBe(codeParam);

    // Submit verification code
    const submitButton = this.page.getByTestId(
      DATA_TEST_IDS.AUTH.VEFIFY_SUBMIT_BUTTON,
    );
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  }

  async logout(): Promise<void> {
    this.page.goto(Routes.Home);

    // Click the user menu button
    const logoutButton = this.page.getByTestId(
      DATA_TEST_IDS.NAVIGATION.USER_MENU,
    );
    await logoutButton.click();

    // Click the logout option
    const logoutOption = this.page.getByTestId(
      DATA_TEST_IDS.NAVIGATION.LOGOUT_BUTTON,
    );
    await logoutOption.click();

    // Verify redirect to login page
    await expect(this.page).toHaveURL(Routes.AuthLogin);
  }
}
