import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LogIn } from '../../pages/LoginPage';

interface PageTestConfig {
  name: string;
  menuSelector?: string;
  urlPattern: RegExp;
  readySelector?: string;
}

const pageConfigs: PageTestConfig[] = [
  { name: 'Dashboard', urlPattern: /dashboard/, readySelector: '.oxd-topbar-header-title' },
  { name: 'PIM', menuSelector: 'span:has-text("PIM")', urlPattern: /pim/, readySelector: '.oxd-topbar-header-title' },
  { name: 'Admin', menuSelector: 'span:has-text("Admin")', urlPattern: /admin/, readySelector: '.oxd-topbar-header-title' },
];

test.describe('OrangeHRM Accessibility Tests', () => {
  let loginObject: LogIn;

  test.beforeEach(async ({ page }) => {
    loginObject = new LogIn(page);
    await loginObject.goto();
    await loginObject.login('Admin', 'admin123');

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('.oxd-topbar-header-title')).toBeVisible();
  });

  for (const config of pageConfigs) {
    test(`Accessibility test on ${config.name} Page`, async ({ page }, testInfo) => {
      if (config.menuSelector && config.name !== 'Dashboard') {
        await page.click(config.menuSelector);
        await expect(page).toHaveURL(config.urlPattern);
      }

      if (config.readySelector) {
        await expect(page.locator(config.readySelector)).toBeVisible();
      }

     
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();

      
      await testInfo.attach(`axe-${config.name}.json`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });

   
      if (results.violations.length > 0) {
        testInfo.annotations.push({
          type: 'a11y',
          description: `${config.name}: ${results.violations.length} violation(s) (color-contrast excluded)`,
        });

        console.log(`\n[A11Y] ${config.name} violations (color-contrast excluded):`);
        for (const v of results.violations) {
          console.log(`- ${v.id} | impact=${v.impact} | nodes=${v.nodes.length}`);
        }
      }
    });
  }
});
