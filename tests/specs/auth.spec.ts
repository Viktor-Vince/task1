import { test } from '../fixtures/base.fixture';
import { ALL_USERS, SHOP_USERS, USERS, getPassword, tagsFor } from '../utils/testData';

/**
 * Authentication
 *
 * Why essential: Login is the entry gate to the entire shop — no user
 * can browse, add to cart or order without it. Both the happy path and
 * error handling (locked account, wrong credentials) must work, otherwise
 * the whole application is unusable.
 */
test.describe('Authentication', () => {
  test(
    'TC01 - successful login redirects to inventory',
    { tag: tagsFor(SHOP_USERS) },
    async ({ unauthLoginPage, currentUser }) => {
      await unauthLoginPage.goto();
      await unauthLoginPage.login(currentUser, getPassword());
      await unauthLoginPage.expectRedirectedToInventory();
    },
  );

  test(
    'TC02 - locked out user sees error and stays on login page',
    { tag: tagsFor([USERS.locked_out_user]) },
    async ({ unauthLoginPage }) => {
      await unauthLoginPage.goto();
      await unauthLoginPage.login(USERS.locked_out_user, getPassword());
      await unauthLoginPage.expectErrorMessage('Sorry, this user has been locked out.');
      await unauthLoginPage.expectLoginPageVisible();
    },
  );

  test(
    'TC03 - wrong password shows error message',
    { tag: tagsFor(ALL_USERS) },
    async ({ unauthLoginPage, currentUser }) => {
      await unauthLoginPage.goto();
      await unauthLoginPage.login(currentUser, 'wrong_password');
      await unauthLoginPage.expectErrorMessage(
        'Username and password do not match any user in this service',
      );
    },
  );
});
