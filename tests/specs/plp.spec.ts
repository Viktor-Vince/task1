import { test } from '../fixtures/base.fixture';
import { SHOP_USERS, SORT_OPTIONS, tagsFor } from '../utils/testData';

/**
 * Product List Page
 *
 * Why essential: PLP is the main entry point after login — it is where users
 * discover products, sort them, and start the purchase flow. A broken listing,
 * sorting, or add-to-cart action blocks every possible order.
 */
test.describe('Product List Page', () => {
  test.beforeEach(async ({ plpPage }) => {
    await plpPage.goto();
  });

  test(
    'TC04 - all products are displayed',
    { tag: tagsFor(SHOP_USERS) },
    async ({ plpPage }) => {
      await plpPage.expectProductsVisible();
      await plpPage.expectProductCount(6);
    },
  );

  test(
    'TC05 - sorting products',
    { tag: tagsFor(SHOP_USERS) },
    async ({ plpPage }) => {
      await test.step('sort by name A→Z', async () => {
        await plpPage.sortBy(SORT_OPTIONS.nameAsc);
        await plpPage.expectSortedByNameAsc();
      });

      await test.step('sort by name Z→A', async () => {
        await plpPage.sortBy(SORT_OPTIONS.nameDesc);
        await plpPage.expectSortedByNameDesc();
      });

      await test.step('sort by price low→high', async () => {
        await plpPage.sortBy(SORT_OPTIONS.priceAsc);
        await plpPage.expectSortedByPriceAsc();
      });
    },
  );

  test(
    'TC06 - adding product to cart from PLP updates cart badge',
    { tag: tagsFor(SHOP_USERS) },
    async ({ plpPage }) => {
      await plpPage.addProductToCartByIndex(0);
      await plpPage.expectCartBadgeCount(1);
    },
  );

  test(
    'TC07 - clicking product navigates to PDP',
    { tag: tagsFor(SHOP_USERS) },
    async ({ plpPage, pdpPage }) => {
      await plpPage.openProductByIndex(0);
      await pdpPage.expectOnPage();
      await pdpPage.expectProductDetailsVisible();
    },
  );
});
