import { Page, expect, Locator } from '@playwright/test';

export class CartPage {
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly removeButtons: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;

  constructor(private page: Page) {
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.removeButtons = page.locator('[data-test^="remove"]');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async removeItemByIndex(index: number) {
    await this.removeButtons.nth(index).click();
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectItemInCart(name: string) {
    await expect(this.itemNames.filter({ hasText: name })).toBeVisible();
  }

  async expectItemPrice(price: string) {
    await expect(this.itemPrices.filter({ hasText: price })).toBeVisible();
  }

  async expectCheckoutButtonVisible() {
    await expect(this.checkoutButton).toBeVisible();
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/.*cart\.html/);
  }
}
