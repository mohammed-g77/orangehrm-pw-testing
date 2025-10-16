import { Page, expect } from "@playwright/test";

export class AddEmployee {
    constructor(private page: Page) { }
    randomNum = Math.floor(Math.random() * 1000);

    // Locators
    private get pimMenu() {
        return this.page.locator('span:has-text("PIM")');
    }

    private get addEmployeeBtn() {
        return this.page.locator('button.oxd-button--secondary:has-text("Add")');
    }

    private get firstNameIn() {
        return this.page.locator('input[name="firstName"]');
    }
    private get middleNameIn() {
        return this.page.locator('input[name="middleName"]');
    }
    private get lastNameIn() {
        return this.page.locator('input[name="lastName"]');
    }
    private get employeeImage() {
        return this.page.locator('oxd-icon bi-plus');
    }
    private get employeeIdIn() {
        return this.page.locator('input.oxd-input').nth(4);
    }
    private get switchLoginDetails() {
        return this.page.locator('span.oxd-switch-input');
    }
    private get userNameIn() {
        return this.page.locator('input.oxd-input').nth(5);
    }
    private get passwordIn() {
        return this.page.locator('input.oxd-input').nth(6);
    }  
    private get confirmPasswordIn() {
        return this.page.locator('input.oxd-input').nth(7);
    }
    private get saveBtn() {
        return this.page.locator('button[type="submit"]:has-text("Save")');
    }
    private get cancelBtn() {
        return this.page.locator('button[type="button"]:has-text("Cancel")');
    }
    // Actions
    async openPIM() {
        await expect(this.pimMenu).toBeVisible();
        await this.pimMenu.click();
    }
    async addEmployee(firstName: string, lastName: string, username: string, password: string, confirmPassword: string, middleName?: string, photo?: string) {
        await expect(this.addEmployeeBtn).toBeVisible();
        await this.addEmployeeBtn.click();
        await expect(this.page).toHaveURL(/addEmployee/);

        await expect(this.firstNameIn).toBeVisible();
        await this.firstNameIn.fill(firstName);
        await expect(this.middleNameIn).toBeVisible();
        await this.middleNameIn.fill(middleName || '');
        await expect(this.lastNameIn).toBeVisible();
        await this.lastNameIn.fill(lastName);
        await expect(this.employeeIdIn).toBeVisible();
        await this.employeeIdIn.fill(`${this.randomNum}`);
        // await expect(this.employeeImage).toBeVisible();
        // await this.employeeImage.setInputFiles('tests/resources/paint.png');
        await expect(this.switchLoginDetails).toBeVisible();
        await this.switchLoginDetails.click();
        await expect(this.userNameIn).toBeVisible();
        await this.userNameIn.fill(`${username}_${this.randomNum}`);
        await expect(this.passwordIn).toBeVisible();
        await this.passwordIn.fill(password);
        await expect(this.confirmPasswordIn).toBeVisible();
        await this.confirmPasswordIn.fill(confirmPassword);
        await expect(this.saveBtn).toBeVisible();
        await expect(this.cancelBtn).toBeVisible();
        await this.saveBtn.click();
        // await this.page.waitForTimeout(10000);
        
        await expect(this.page.locator('h6:has-text("Personal Details")')).toBeVisible({ timeout: 10000 });

    }
}