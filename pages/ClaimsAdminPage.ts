import { Page, expect } from "@playwright/test";

export class ClaimsAdminPage {
  constructor(private page: Page) {}

  // Locators - Admin processing claims
  private get claimsMenu() {
    return this.page.locator('span:has-text("Claim")');
  }

  private get employeeClaimMenu() {
    return this.page.locator('a:has-text("Employee Claim")');
  }

  private get claimListTable() {
    return this.page.locator('.oxd-table-card');
  }

  private get claimRow() {
    return this.page.locator('.oxd-table-card');
  }

  private get viewClaimBtn() {
    return this.page.locator('button:has-text("View")');
  }

  private get approveClaimBtn() {
    return this.page.locator('button:has-text("Approve")');
  }

  private get rejectClaimBtn() {
    return this.page.locator('button:has-text("Reject")');
  }

  private get cancelActionBtn() {
    return this.page.locator('button[type="button"]:has-text("Cancel")');
  }

  private get confirmBtn() {
    return this.page.locator('button[type="button"]:has-text("Yes, Confirm")');
  }

  private get actionNoteInput() {
    return this.page.locator('textarea[placeholder*="Note"]');
  }

  // Status locators for assertions
  private get claimStatus() {
    return this.page.locator('.oxd-text--subtitle-2');
  }

  private get successMessage() {
    return this.page.locator('.oxd-toast-container');
  }

  // Actions - Navigate to Employee Claims
  async gotoClaims() {
    await expect(this.claimsMenu).toBeVisible();
    await this.claimsMenu.click();
  }

  async gotoEmployeeClaims() {
    await expect(this.employeeClaimMenu).toBeVisible();
    await this.employeeClaimMenu.click();
    await expect(this.page).toHaveURL(/employeeClaim/);
  }

  // Actions - Process Claims
  async viewClaim(employeeName?: string) {
    if (employeeName) {
      // Find claim by employee name
      const claimRow = this.page.locator(`text=${employeeName}`).locator('..').locator('..');
      await claimRow.locator('button:has-text("View")').click();
    } else {
      // View first claim
      await expect(this.viewClaimBtn.first()).toBeVisible();
      await this.viewClaimBtn.first().click();
    }
  }

  async approveClaim(note?: string) {
    await expect(this.approveClaimBtn).toBeVisible();
    await this.approveClaimBtn.click();
    
    if (note) {
      await expect(this.actionNoteInput).toBeVisible();
      await this.actionNoteInput.fill(note);
    }

    await expect(this.confirmBtn).toBeVisible();
    await this.confirmBtn.click();
    
    // Wait for success message
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  async rejectClaim(note?: string) {
    await expect(this.rejectClaimBtn).toBeVisible();
    await this.rejectClaimBtn.click();
    
    if (note) {
      await expect(this.actionNoteInput).toBeVisible();
      await this.actionNoteInput.fill(note);
    }

    await expect(this.confirmBtn).toBeVisible();
    await this.confirmBtn.click();
    
    // Wait for success message
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  // Actions - Assertions
  async verifyClaimStatus(expectedStatus: string) {
    await expect(this.claimStatus).toContainText(expectedStatus);
  }

  async verifyClaimInList(employeeName: string, expectedStatus?: string) {
    const claimRow = this.page.locator(`text=${employeeName}`).locator('..').locator('..');
    await expect(claimRow).toBeVisible();
    
    if (expectedStatus) {
      await expect(claimRow.locator(`text=${expectedStatus}`)).toBeVisible();
    }
  }

  async getClaimStatus(employeeName: string): Promise<string> {
    const claimRow = this.page.locator(`text=${employeeName}`).locator('..').locator('..');
    const statusText = await claimRow.locator('.oxd-text--subtitle-2').textContent();
    return statusText?.trim() || '';
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }
}

