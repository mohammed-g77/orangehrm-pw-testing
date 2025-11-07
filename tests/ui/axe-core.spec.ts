import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LogIn } from '../../pages/LoginPage';

test.describe('OrangeHRM Accessibility Tests', () => {
  let loginObject: LogIn;
  
  test.beforeEach(async ({ page }) => {
    loginObject = new LogIn(page);
    await loginObject.goto();
    await loginObject.login('Admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Accessibility test on Dashboard Page', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Accessibility test on PIM Page', async ({ page }) => {
    await page.click('span:has-text("PIM")');
    await expect(page).toHaveURL(/pim/);
    
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('Accessibility test on Admin Page', async ({ page }) => {
    await page.click('span:has-text("Admin")');
    await expect(page).toHaveURL(/admin/);
    
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});