# orangehrm-pw-testing

Automated end-to-end tests for [OrangeHRM](https://www.orangehrm.com/) using **Playwright**.

## 📂 Project Structure

orangehrm-pw-testing/
├─ node_modules/ # Ignored by Git
├─ tests/ # Playwright test scripts
├─ .github/
│ └─ workflows/
│ └─ playwright.yml # GitHub Actions workflow
├─ package.json
├─ package-lock.json
└─ README.md

bash
Copy code

## ⚡ Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/mohammed-g77/orangehrm-pw-testing.git
cd orangehrm-pw-testing
Install dependencies

bash
Copy code
npm install
Run tests locally

bash
Copy code
npx playwright test
Make sure you have Node.js installed.

🏗 GitHub Actions
This project uses a Playwright workflow to automatically run tests on every push or pull request.
You can monitor test results in the Actions tab of your GitHub repository.

⚙ Configuration
Tests are written in Playwright using JavaScript.

node_modules is ignored in Git (.gitignore).

Add or modify tests inside the tests/ directory.

📄 License
This project is licensed under the MIT License.