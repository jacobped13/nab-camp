import { test, expect } from "@playwright/test";

import { Routes } from "@/app/routes/routes";
import { AuthHelper } from "@/e2e/auth/auth";
import { E2E_USERS } from "@/e2e/consts";

test.describe("Authentication Flow", () => {
  test("should redirect unauthenticated user to login when accessing protected route", async ({
    page,
  }) => {
    await page.goto(Routes.Home);
    await expect(page).toHaveURL(Routes.AuthLogin);
  });

  test("should allow user to complete full authentication flow", async ({
    page,
  }) => {
    const auth = new AuthHelper({ page, email: E2E_USERS.Auth.email });
    await auth.authenticate();
    await expect(page).toHaveURL(new RegExp(`${Routes.AccountRegistration}.*`));
  });
});
