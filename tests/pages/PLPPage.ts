import { Page, expect, Locator } from '@playwright/test';
import { SortOption } from '../utils/testData';

export class PLPPage {
  private readonly productItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly productNames: Locator;
  private readonly productPrices: Locator;
  private readonly addToCartButtons: Locator;
  private readonly cartBadge: Locator;
  private readonly cartIcon: Locator;

  constructor(private page: Page) {
    this.productItems = page.getByTestId('inventory-item');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartIcon = page.getByTestId('shopping-cart-link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async addProductToCartByIndex(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  async openProductByIndex(index: number) {
    await this.productNames.nth(index).click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async getProductNameByIndex(index: number): Promise<string> {
    const text = await this.productNames.nth(index).textContent();
    if (!text) throw new Error(`Product name at index ${index} not found`);
    return text;
  }

  async getProductPriceByIndex(index: number): Promise<string> {
    const text = await this.productPrices.nth(index).textContent();
    if (!text) throw new Error(`Product price at index ${index} not found`);
    return text;
  }

  async expectProductsVisible() {
    await expect(this.productItems.first()).toBeVisible();
  }

  async expectProductCount(count: number) {
    await expect(this.productItems).toHaveCount(count);
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectSortedByNameAsc() {
    const names = await this.productNames.allTextContents();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  }

  async expectSortedByNameDesc() {
    const names = await this.productNames.allTextContents();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  }

  async expectSortedByPriceAsc() {
    const prices = await this.productPrices.allTextContents();
    const values = prices.map((p) => parseFloat(p.replace('$', '')));
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  }
}
