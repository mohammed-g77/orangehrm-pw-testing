# OrangeHRM Playwright Testing

This repository contains end-to-end tests for the OrangeHRM application using Playwright. The tests focus on key functionalities such as login, ensuring reliable automation for UI interactions.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Fixtures](#fixtures)
- [Reporting](#reporting)
- [Contributing](#contributing)
- [License](#license)

 
## Installation

1. Clone the repository:
```
git clone https://github.com/mohammed-g77/orangehrm-pw-testing.git
cd orangehrm-pw-testing
```

2. Install dependencies:
```
npm install
```
3. Install Playwright browsers:
```
npx playwright install
```
## Project Structure

- **.github/workflows**: GitHub Actions workflows for CI/CD.
- **fixtures**: Custom fixtures for test setup (e.g., page objects or data providers).
- **node_modules**: Installed dependencies (not tracked in Git).
- **pages**: Page Object Models (e.g., `LoginPage.ts` for login-related interactions,`addEmployee.spec.ts` for addEmployee-related interactions ).
- **test-results**: Generated test artifacts like screenshots, videos, and traces.
- **tests**: Test specs (e.g., `login.spec.ts` for login tests ,`addEmployee.spec.ts` for addEmployee tests ).
- **playwright.yml**: Playwright configuration file.
- **.gitignore**: Files and directories to ignore in Git.
- **package.json**: Project metadata and dependencies.
- **package-lock.json**: Locked versions of dependencies.

## Running Tests

To run all tests in headless mode:
```
npx playwright test
```
Run tests in headed mode (with browser UI):
```
npx playwright test --headed
```
Run a specific test file:
```
npx playwright test tests/login.spec.ts

```

## Configuration

The main configuration is in `playwright.yml`. Key settings include:
- Browser projects (e.g., Chromium, Firefox, WebKit).
- Base URL for the OrangeHRM instance (update as needed).
- Retries, timeouts, and workers for parallel execution.

Example snippet:
```
yaml
projects:
  - name: 'chromium'
    use: { ...devices['Desktop Chrome'] }
```
## Fixtures
Fixtures are defined in the fixtures directory. They provide reusable setup for tests, such as authenticated sessions or mocked data.

## Reporting
After running tests, view the HTML report:
```
npx playwright show-report
```
Test results (including failures) are stored in `test-results`.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-test`).
3. Commit changes (`git commit -m 'Add new test'`).
4. Push to the branch (`git push origin feature/new-test`).
5. Open a Pull Request.

Please follow code style guidelines and add tests for new features.