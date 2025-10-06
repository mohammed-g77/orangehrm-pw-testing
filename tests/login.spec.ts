import { test, expect } from '@playwright/test';
import { LogIn } from '../pages/LoginPage';

test('Login to OrangeHRM Demo site', async ({ page }) => {
  const loginObject = new LogIn(page);

  await page.goto('https://opensource-demo.orangehrmlive.com/');
  await loginObject.login('Admin', 'admin123');

  
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('h6')).toContainText('Dashboard');
});