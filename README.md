# eBay Wallet Related Products Automation

Automated testing for eBay's related products feature using Playwright and Page Object Model.

## Setup

```bash
npm install
npx playwright install
```

## Run Tests

```bash
npm test                  # Run all tests
npm run test:headed       # Run with visible browser
npm run test:debug        # Debug mode
npm run report            # View test report
```

## Project Structure

```
automation/
├── tests/                # Test files
├── pages/                # Page objects
├── utils/                # Helper functions
└── playwright.config.js  # Configuration
```

## Test Coverage

- TC01-04: Core functionality (display, count, category, price)
- TC05-06: Edge cases (fewer/no products)
- TC07-10: Data quality (duplicates, images, titles, prices)

## Configuration

- Browsers: Chromium, Firefox, WebKit
- Timeout: 30s navigation, 15s actions
- Reports: HTML with screenshots on failure