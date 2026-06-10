import { Page, expect, Locator } from '@playwright/test';

export class PDPPage {
  private readonly productName: Locator;
  private readonly productDescription: Locator;
  private readonly productPrice: Locator;
  constructor(private page: Page) {
    this.productName = page.getByTestId('inventory-item-name');
    this.productDescription = page.getByTestId('inventory-item-desc');
    this.productPrice = page.getByTestId('inventory-item-price');
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/.*inventory-item\.html/);
  }

  async expectProductDetailsVisible() {
    await expect(this.productName).toBeVisible();
    await expect(this.productDescription).toBeVisible();
    await expect(this.productPrice).toBeVisible();
  }
}
