# Playwright Test Suite — SauceDemo

Automated end-to-end tests for [saucedemo.com](https://www.saucedemo.com) written with [Playwright](https://playwright.dev/).

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` and fill in the credentials:

```bash
cp .env.example .env
```

```
BASE_URL=https://www.saucedemo.com
TEST_PASSWORD=your_password_here
```

## Running tests

```bash
# Run all tests (headless)
npm run test

# Run with visible browser
npm run test:headed

# Open interactive UI mode
npm run test:ui

# View last HTML report
npm run test:report
```

## Test cases

| ID | Spec | Description | Why essential |
|----|------|-------------|---------------|
| TC01 | auth | Successful login redirects to inventory | Login is the entry gate — without it no user can reach any feature |
| TC02 | auth | Locked out user sees error and stays on login page | Locked accounts must be rejected; silent failure would be a security issue |
| TC03 | auth | Wrong password shows error message | Incorrect credentials must surface a clear error, not a broken state |
| TC04 | plp | All 6 products are displayed | Core content — empty listing makes the shop unusable |
| TC05 | plp | Products can be sorted by name and price | Primary discovery tool; broken sorting hides products from users |
| TC06 | plp | Adding product updates cart badge | Immediate feedback that the cart action worked |
| TC07 | plp | Clicking product navigates to PDP | Main navigation path to product detail |
| TC08 | cart | Product added from PLP appears in cart | Cart must reflect what the user selected |
| TC09 | cart | Removing product empties the cart | Users must be able to undo add-to-cart |
| TC10 | cart | Product price in cart matches price on PLP | Price mismatch is a trust and compliance issue |
| TC11 | cart | Empty cart shows checkout button | Cart must be accessible even before adding items |
| TC12 | checkout | Complete purchase flow from login to order confirmation | Full critical path — any broken step prevents order completion |

## Parallelisation strategy

There is **one Playwright project per user** (`e2e:standard_user`, `e2e:locked_out_user`, …). Each project:

- sets `fullyParallel: false` — tests within the project run sequentially on a single worker
- sets `grep: /@<username>/` — only tests tagged with that user's name are picked up
- has `workers: 6` globally — one worker slot per project, so all 6 run in parallel

This guarantees that at any given moment **at most one test per user is running** — no two tests share the same authenticated session concurrently.

Tests are tagged in source with `tagsFor(SHOP_USERS)` or `tagsFor(ALL_USERS)` helpers:

```
e2e:standard_user   → grep /@standard_user/   → TC01 TC03–TC12
e2e:locked_out_user → grep /@locked_out_user/ → TC02 TC03
e2e:problem_user    → grep /@problem_user/    → TC01 TC03–TC12
…
```

A global setup project authenticates all 6 users once and saves their sessions to `tests/auth/` (gitignored). Each e2e project reuses the saved session — login overhead is paid once, not once per test.

| User | Expected behaviour |
|------|--------------------|
| standard_user | All tests pass |
| locked_out_user | Login blocked — TC02 passes, TC03 passes, all shop tests excluded by grep |
| problem_user | TC05, TC12 fail — sorting and checkout finish button broken (intentional bugs) |
| performance_glitch_user | All tests pass (with noticeable slowdown) |
| error_user | TC12 fails — checkout finish button broken (intentional bug) |
| visual_user | TC05, TC10 fail — sorting and price mismatch in cart (intentional bugs) |

## Security

Traces are disabled for the auth setup project (`trace: 'off'`) to prevent credentials from being captured in network request recordings. Regular test projects use `trace: 'on-first-retry'` — these are safe because they authenticate via session cookie, not raw credentials.

`tests/auth/` (session files) and `.env` (credentials) are gitignored and never committed.

## Project structure

```
tests/
├── auth/               # saved session files (gitignored)
├── fixtures/
│   └── base.fixture.ts # injects all page objects via Playwright DI
├── pages/              # Page Object Model — selectors, actions, assertions
├── setup/
│   └── auth.setup.ts   # authenticates all users before the test run
├── specs/              # test files — orchestration only, no selectors
└── utils/
    └── testData.ts     # users, credentials, checkout data, sort options
```
