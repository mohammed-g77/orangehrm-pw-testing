import { Page, expect } from "@playwright/test";

export class LogIn {
  constructor(private page: Page) {}

  // Locators
  private get userNameIn() {
    return this.page.locator('input[name="username"]');
  }

  private get passWordIn() {
    return this.page.locator('input[name="password"]');
  }

  private get logInBtn() {
    return this.page.locator('button[type="submit"]');
  }

  // Action

  async goto() {
    await this.page.goto("https://opensource-demo.orangehrmlive.com/");
  }

  async login(username: string, password: string) {
    await expect(this.userNameIn).toBeVisible();
    await this.userNameIn.fill(username);

    await expect(this.passWordIn).toBeVisible();
    await this.passWordIn.fill(password);

    await expect(this.logInBtn).toBeEnabled();
    await this.logInBtn.click();
  }
}
