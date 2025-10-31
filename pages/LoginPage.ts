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
    // Wait for page to load - check for login form elements
    await expect(this.userNameIn).toBeVisible({ timeout: 10000 });
  }

  async login(username: string, password: string) {
    // Wait for login form to be ready
    await expect(this.userNameIn).toBeVisible({ timeout: 10000 });
    await this.userNameIn.fill(username);

    await expect(this.passWordIn).toBeVisible({ timeout: 10000 });
    await this.passWordIn.fill(password);

    await expect(this.logInBtn).toBeEnabled({ timeout: 10000 });
    await this.logInBtn.click();
  }

  async logout() {
    await this.page.locator('.oxd-userdropdown-tab').click();
    await this.page.locator('a:has-text("Logout")').click();
    
    // Wait for navigation to login page
    await expect(this.page).toHaveURL(/auth\/login/, { timeout: 10000 });
    
    // Wait for login form to be ready after logout
    await expect(this.userNameIn).toBeVisible({ timeout: 10000 });
  }
}
