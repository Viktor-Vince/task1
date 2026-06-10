import { test } from '../fixtures/base.fixture';
import { SHOP_USERS, tagsFor } from '../utils/testData';

/**
 * Cart
 *
 * Why essential: Cart is the last checkpoint before checkout — it is where
 * the user reviews their order. Incorrect items, wrong prices, or broken
 * remove functionality directly prevent order completion or cause the user
 * to purchase something unintended.
 */
test.describe('Cart', () => {
  test.describe('with product added from PLP', () => {
    test.beforeEach(async ({ plpPage }) => {
      await plpPage.goto();
    });

    test(
      'TC08 - product added from PLP appears in cart',
      { tag: tagsFor(SHOP_USERS) },
      async ({ plpPage, cartPage }) => {
        const productName = await plpPage.getProductNameByIndex(0);

        await plpPage.addProductToCartByIndex(0);
        await plpPage.goToCart();

        await cartPage.expectItemCount(1);
        await cartPage.expectItemInCart(productName);
      },
    );

    test(
      'TC09 - removing product from cart empties the cart',
      { tag: tagsFor(SHOP_USERS) },
      async ({ plpPage, cartPage }) => {
        await plpPage.addProductToCartByIndex(0);
        await plpPage.goToCart();

        await cartPage.removeItemByIndex(0);

        await cartPage.expectItemCount(0);
      },
    );

    test(
      'TC10 - product price in cart matches price on PLP',
      { tag: tagsFor(SHOP_USERS) },
      async ({ plpPage, cartPage }) => {
        const plpPrice = await plpPage.getProductPriceByIndex(0);

        await plpPage.addProductToCartByIndex(0);
        await plpPage.goToCart();

        await cartPage.expectItemPrice(plpPrice);
      },
    );
  });

  test(
    'TC11 - empty cart shows checkout button',
    { tag: tagsFor(SHOP_USERS) },
    async ({ cartPage }) => {
      await cartPage.goto();

      await cartPage.expectItemCount(0);
      await cartPage.expectCheckoutButtonVisible();
    },
  );
});
