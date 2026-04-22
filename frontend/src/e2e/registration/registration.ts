import { expect, type Page } from "@playwright/test";

import { Routes } from "@/app/routes/routes";
import { DATA_TEST_IDS } from "@/e2e/consts";

type RegistrationHelperArgs = {
  page: Page;
  firstName: string;
  lastName: string;
  workspaceName: string;
  workspaceUrl: string;
};

export class RegistrationHelper {
  private page: Page;
  private firstName: string;
  private lastName: string;
  private workspaceName: string;
  private workspaceUrl: string;

  constructor({
    page,
    firstName,
    lastName,
    workspaceName,
    workspaceUrl,
  }: RegistrationHelperArgs) {
    this.page = page;
    this.firstName = firstName;
    this.lastName = lastName;
    this.workspaceName = workspaceName;
    this.workspaceUrl = workspaceUrl;
  }

  async completeRegistration(): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(`${Routes.AccountRegistration}.*`),
    );
    await this.registerUser();
    await this.registerWorkspace();
    await this.selectPlan();
    await this.completePayment();
  }

  async registerUser(): Promise<void> {
    // Fill out the first name input
    await this.page
      .getByTestId(DATA_TEST_IDS.REGISTRATION.USER.FIRSTNAME_INPUT)
      .fill(this.firstName);

    // Fill out the last name input
    await this.page
      .getByTestId(DATA_TEST_IDS.REGISTRATION.USER.LASTNAME_INPUT)
      .fill(this.lastName);

    // Submit the user registration form
    const submitButton = this.page.getByTestId(
      DATA_TEST_IDS.REGISTRATION.USER.SUBMIT_BUTTON,
    );
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  }

  async registerWorkspace(): Promise<void> {
    // Fill out the workspace name input
    await this.page
      .getByTestId(DATA_TEST_IDS.REGISTRATION.WORKSPACE.NAME_INPUT)
      .fill(this.workspaceName);

    // Fill out the workspace URL input
    await this.page
      .getByTestId(DATA_TEST_IDS.REGISTRATION.WORKSPACE.URL_INPUT)
      .fill(this.workspaceUrl);

    // Submit the workspace registration form
    const submitButton = this.page.getByTestId(
      DATA_TEST_IDS.REGISTRATION.WORKSPACE.SUBMIT_BUTTON,
    );
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  }

  async selectPlan(planIndex: number = 0): Promise<void> {
    // Wait for plan cards to be visible
    const planCards = this.page.getByTestId(
      DATA_TEST_IDS.REGISTRATION.PLAN.PLAN_CARD,
    );
    await expect(planCards.first()).toBeVisible();

    // Select the specified plan (default to first plan)
    await planCards.nth(planIndex).click();

    // Submit the plan selection
    const submitButton = this.page.getByTestId(
      DATA_TEST_IDS.REGISTRATION.PLAN.SUBMIT_BUTTON,
    );
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  }

  async completePayment(): Promise<void> {
    // Wait for Stripe iframe to be ready and get frame locator
    const stripeFrame = this.page.locator("iframe").first().contentFrame();

    const stripeTestCard = {
      cardNumber: "4242424242424242",
      expiry: "01/50",
      cvc: "123",
      country: "United States",
      postalCode: "84790",
    };

    await stripeFrame
      .locator('input[name="number"]')
      .fill(stripeTestCard.cardNumber);

    await stripeFrame
      .locator('input[name="expiry"]')
      .fill(stripeTestCard.expiry);

    await stripeFrame.locator('input[name="cvc"]').fill(stripeTestCard.cvc);

    await stripeFrame
      .locator('select[name="country"]')
      .selectOption(stripeTestCard.country);

    await stripeFrame
      .locator('input[name="postalCode"]')
      .fill(stripeTestCard.postalCode);

    // Submit payment form
    const paymentSubmitButton = this.page.getByTestId(
      DATA_TEST_IDS.REGISTRATION.PAYMENT.SUBMIT_BUTTON,
    );
    await expect(paymentSubmitButton).toBeVisible();
    await expect(paymentSubmitButton).toBeEnabled();
    await paymentSubmitButton.click();

    // Verify successful registration (redirect to main app)
    await expect(this.page).toHaveURL(Routes.Home, {
      timeout: 10_000,
    });
  }
}
