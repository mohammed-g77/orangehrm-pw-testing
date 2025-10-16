import { test, expect } from '@playwright/test';
import { LogIn } from '../../pages/LoginPage';
import { AddEmployee } from '../../pages/AddEmployee';

test('Add empolyee after login', async ({ page }) => {
    const login = new LogIn(page);
    const pim = new AddEmployee(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h6')).toContainText('Dashboard');

    await pim.openPIM();
    await pim.addEmployee("Haneen", "Ibrahem", "Haneen123", "Haneen@123", "Haneen@123", "M");
});