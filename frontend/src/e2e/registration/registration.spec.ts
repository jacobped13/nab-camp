import { test, expect } from "@playwright/test";

import { Routes } from "@/app/routes/routes";
import { AuthHelper } from "@/e2e/auth/auth";
import { E2E_USERS } from "@/e2e/consts";
import { RegistrationHelper } from "@/e2e/registration/registration";

test.describe("Registration Flow", () => {
  test("should complete full registration flow", async ({ page }) => {
    const authHelper = new AuthHelper({
      page,
      email: E2E_USERS.Registration.email,
    });

    const registrationHelper = new RegistrationHelper({
      page,
      firstName: E2E_USERS.Registration.firstName,
      lastName: E2E_USERS.Registration.lastName,
      workspaceName: E2E_USERS.Registration.workspaceName,
      workspaceUrl: E2E_USERS.Registration.workspaceUrl,
    });

    await authHelper.authenticate();
    await registrationHelper.completeRegistration();
    await expect(page).toHaveURL(Routes.Home);

    // Verify user is redirected to home page if they try to access
    // Registration once they have already registered
    await page.goto(Routes.AccountRegistration);
    await expect(page).toHaveURL(Routes.Home);
  });
});
