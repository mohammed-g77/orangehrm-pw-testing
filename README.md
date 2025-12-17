# OrangeHRM Playwright Automation Project

A Playwright test automation project for testing the **OrangeHRM** web application. This project includes UI tests, API tests, and accessibility tests using the Page Object Model (POM) pattern.

---

## What This Project Tests

This project automates testing for the following areas of OrangeHRM:

| Area | Description |
|------|-------------|
| **Login** | User authentication (login/logout) |
| **Dashboard** | Main dashboard after login |
| **PIM (Personnel Information Management)** | Adding employees |
| **Admin** | Admin page functionality |
| **Leave Management** | Leave entitlement and approval workflows |
| **Accessibility** | WCAG accessibility checks using Axe-core |

---

## Tech Stack

- **[Playwright](https://playwright.dev/)** - End-to-end testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright)** - Accessibility testing

---

## Folder Structure

```
orangehrm-pw-testing/
├── pages/                  # Page Object Model classes
│   ├── LoginPage.ts        # Login page actions & selectors
│   ├── AddEmployee.ts      # Add employee page
│   └── LeavePage.ts        # Leave management page
├── tests/
│   ├── ui/                 # UI (E2E) tests
│   │   ├── login.spec.ts
│   │   ├── addEmployee.spec.ts
│   │   └── axe-core.spec.ts    # Accessibility tests
│   └── api/                # API tests
│       ├── addEmployeesAndLeaveEntitlement.spec.ts
│       └── EmployeeLeaveApplicationAndAdminApproval.spec.ts
├── helpers/                # Utility/helper functions
├── data/                   # Test data files
├── package.json
└── tsconfig.json
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/mohammed-g77/orangehrm-pw-testing.git
cd orangehrm-pw-testing
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

---

## How to Run Tests

### Run all tests

```bash
npx playwright test
```

### Run all tests with browser visible (headed mode)

```bash
npx playwright test --headed
```

### Run a specific test file

```bash
# Run login tests only
npx playwright test tests/ui/login.spec.ts

# Run accessibility tests only
npx playwright test tests/ui/axe-core.spec.ts
```

### Run tests in UI mode (interactive)

```bash
npx playwright test --ui
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

### View HTML test report

After running tests, view the report:

```bash
npx playwright show-report
```

---

## Accessibility Testing

This project uses **@axe-core/playwright** to run accessibility tests against OrangeHRM pages.

### How to run accessibility tests

```bash
npx playwright test tests/ui/axe-core.spec.ts
```

### Pages tested for accessibility

- Dashboard
- PIM (Personnel Information Management)
- Admin

### Where to find accessibility reports

After running accessibility tests, you can find the results in:

1. **Console output** - Violations are logged to the console
2. **Test artifacts** - JSON files attached to each test:
   - `axe-Dashboard.json`
   - `axe-PIM.json`
   - `axe-Admin.json`
3. **HTML Report** - Run `npx playwright show-report` to see detailed results

### Current exclusions

> **Note:** The `color-contrast` rule is temporarily disabled because OrangeHRM has known color contrast issues. This allows the tests to focus on other accessibility violations first.

---

## Notes / Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Cannot find module '@axe-core/playwright'` | Run `npm install` to install dependencies |
| `Browser not found` | Run `npx playwright install` to install browsers |
| Tests timeout | Increase timeout in test or check if OrangeHRM is accessible |
| Login fails | Verify credentials: username = `Admin`, password = `admin123` |

### OrangeHRM Demo URL

Tests run against the OrangeHRM demo instance. Make sure you have internet access.

### Tips

- Use `--headed` flag to see the browser while tests run
- Use `--debug` flag to step through tests
- Use `--ui` flag for an interactive test runner experience

---

## Scripts

Available npm scripts in `package.json`:

```bash
# Run all tests in headed mode
npm test
```

---

## License

This project is licensed under the **ISC License**.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

**Happy Testing!** 