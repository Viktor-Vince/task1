import { test } from '../fixtures/base.fixture';
import { getPassword, CHECKOUT_DATA, SHOP_USERS, tagsFor } from '../utils/testData';

/**
 * Full E2E Checkout Flow
 *
 * Why essential: This test covers the entire critical path of the application —
 * from login to order confirmation. If any step in this chain breaks, the user
 * cannot complete a purchase. Running it per user also surfaces user-specific
 * bugs (e.g. broken flows for problem_user or error_user).
 *
 * All page objects share a single unauthenticated context so the full flow
 * runs in one browser session — from login through to order confirmation.
 */
test.describe('E2E Checkout Flow', () => {
  test(
    'TC12 - complete purchase flow from login to order confirmation',
    { tag: tagsFor(SHOP_USERS) },
    async ({ checkoutFlowPages, currentUser }) => {
      const { loginPage, plpPage, cartPage, checkoutAddressPage, checkoutSummaryPage, thankYouPage } =
        checkoutFlowPages;

      await test.step('Login', async () => {
        await loginPage.goto();
        await loginPage.login(currentUser, getPassword());
        await loginPage.expectRedirectedToInventory();
      });

      await test.step('Add product to cart', async () => {
        await plpPage.addProductToCartByIndex(0);
        await plpPage.expectCartBadgeCount(1);
      });

      await test.step('Verify cart', async () => {
        await plpPage.goToCart();
        await cartPage.expectOnPage();
        await cartPage.expectItemCount(1);
        await cartPage.expectCheckoutButtonVisible();
      });

      await test.step('Fill address', async () => {
        await cartPage.proceedToCheckout();
        await checkoutAddressPage.expectOnPage();
        await checkoutAddressPage.expectAddressFormVisible();
        await checkoutAddressPage.fillAddress(
          CHECKOUT_DATA.firstName,
          CHECKOUT_DATA.lastName,
          CHECKOUT_DATA.zipCode,
        );
        await checkoutAddressPage.continue();
      });

      await test.step('Verify summary', async () => {
        await checkoutSummaryPage.expectOnPage();
        await checkoutSummaryPage.expectSummaryVisible();
        await checkoutSummaryPage.expectItemCount(1);
        await checkoutSummaryPage.finish();
      });

      await test.step('Verify order confirmation', async () => {
        await thankYouPage.expectOnPage();
        await thankYouPage.expectOrderConfirmed();
      });
    },
  );
});
