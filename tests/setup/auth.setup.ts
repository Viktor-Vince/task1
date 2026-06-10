import { test as setup } from '@playwright/test';
import { USERS, getPassword } from '../utils/testData';
import path from 'path';

for (const username of Object.values(USERS)) {
  setup(`authenticate: ${username}`, async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(getPassword());
    await page.getByTestId('login-button').click();

    if (username === USERS.locked_out_user) {
      await page.getByTestId('error').waitFor();
      await page.context().storageState({ path: path.join(__dirname, '../auth', `${username}.json`) });
      return;
    }

    await page.waitForURL('**/inventory.html');
    await page.context().storageState({ path: path.join(__dirname, '../auth', `${username}.json`) });
  });
}
