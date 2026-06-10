import { Page, expect, Locator } from '@playwright/test';

export class ThankYouPage {
  private readonly confirmationHeader: Locator;
  private readonly confirmationText: Locator;
  constructor(private page: Page) {
    this.confirmationHeader = page.getByTestId('complete-header');
    this.confirmationText = page.getByTestId('complete-text');
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
  }

  async expectOrderConfirmed() {
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationHeader).toContainText('Thank you');
    await expect(this.confirmationText).toBeVisible();
  }
}
