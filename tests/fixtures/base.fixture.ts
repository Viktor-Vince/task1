import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PLPPage } from '../pages/PLPPage';
import { PDPPage } from '../pages/PDPPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutAddressPage } from '../pages/CheckoutAddressPage';
import { CheckoutSummaryPage } from '../pages/CheckoutSummaryPage';
import { ThankYouPage } from '../pages/ThankYouPage';
import { USERS, Username } from '../utils/testData';
import path from 'path';

export type CheckoutFlowPages = {
  loginPage: LoginPage;
  plpPage: PLPPage;
  cartPage: CartPage;
  checkoutAddressPage: CheckoutAddressPage;
  checkoutSummaryPage: CheckoutSummaryPage;
  thankYouPage: ThankYouPage;
};

type PageFixtures = {
  currentUser: Username;
  unauthLoginPage: LoginPage;
  plpPage: PLPPage;
  pdpPage: PDPPage;
  cartPage: CartPage;
  checkoutAddressPage: CheckoutAddressPage;
  checkoutSummaryPage: CheckoutSummaryPage;
  thankYouPage: ThankYouPage;
  unauthPage: Page;
  checkoutFlowPages: CheckoutFlowPages;
};

export const test = base.extend<PageFixtures>({
  // Set per project via `use: { currentUser: '...' }` in playwright.config.ts.
  currentUser: [USERS.standard_user, { option: true }],

  // Overrides default page to load the project's authenticated session.
  page: async ({ browser, currentUser }, use) => {
    const authPath = path.join(__dirname, '../auth', `${currentUser}.json`);
    const context = await browser.newContext({ storageState: authPath });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Clean unauthenticated page — used by auth and E2E checkout tests.
  unauthPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // All checkout flow page objects sharing a single unauthenticated context.
  checkoutFlowPages: async ({ unauthPage }, use) => {
    await use({
      loginPage: new LoginPage(unauthPage),
      plpPage: new PLPPage(unauthPage),
      cartPage: new CartPage(unauthPage),
      checkoutAddressPage: new CheckoutAddressPage(unauthPage),
      checkoutSummaryPage: new CheckoutSummaryPage(unauthPage),
      thankYouPage: new ThankYouPage(unauthPage),
    });
  },

  unauthLoginPage: async ({ unauthPage }, use) => use(new LoginPage(unauthPage)),
  plpPage: async ({ page }, use) => use(new PLPPage(page)),
  pdpPage: async ({ page }, use) => use(new PDPPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutAddressPage: async ({ page }, use) => use(new CheckoutAddressPage(page)),
  checkoutSummaryPage: async ({ page }, use) => use(new CheckoutSummaryPage(page)),
  thankYouPage: async ({ page }, use) => use(new ThankYouPage(page)),
});

export { expect } from '@playwright/test';
