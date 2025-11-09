import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LogIn } from '../../pages/LoginPage';

interface PageTestConfig {
  name: string;
  menuSelector?: string;
  urlPattern: RegExp;
}

const pageConfigs: PageTestConfig[] = [
  { name: 'Dashboard', urlPattern: /dashboard/ },
  { name: 'PIM', menuSelector: 'span:has-text("PIM")', urlPattern: /pim/ },
  { name: 'Admin', menuSelector: 'span:has-text("Admin")', urlPattern: /admin/ }
];

test.describe('OrangeHRM Accessibility Tests', () => {
  let loginObject: LogIn;

  test.beforeEach(async ({ page }) => {
    loginObject = new LogIn(page);
    await loginObject.goto();
    await loginObject.login('Admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/);
  });

  for (const config of pageConfigs) {
    test(`Accessibility test on ${config.name} Page`, async ({ page }) => {
      if (config.menuSelector && config.name !== 'Dashboard') {
        await page.click(config.menuSelector);
        await expect(page).toHaveURL(config.urlPattern);
      }

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});