import { Page, expect } from "@playwright/test";

export class LeavePage {
  constructor(private page: Page) {}

  //   Locators

  private get leaveMenu() {
    return this.page.locator('span:has-text("Leave")');
  }

  private get applyMenuItem() {
    return this.page.locator('a[href*="applyLeave"]');
  }

  private get myLeaveMenuItem() {
    return this.page.locator('a[href*="viewMyLeaveList"]');
  }

  private get leaveTypeDropdown() {
    return this.page.locator('div.oxd-select-text');
  }

  private get fromDateInput() {
    return this.page.locator('input[placeholder="yyyy-mm-dd"]').first();
  }

  private get toDateInput() {
    return this.page.locator('input[placeholder="yyyy-mm-dd"]').last();
  }

  private get commentBox() {
    return this.page.locator('textarea[placeholder="Type here"]');
  }

  private get applyButton() {
    return this.page.locator('button[type="submit"]:has-text("Apply")');
  }

  private get successToast() {
    return this.page.locator('p:has-text("Successfully")');
  }

  //  Actions

    
  async openLeavePage() {
    await expect(this.leaveMenu).toBeVisible();
    await this.leaveMenu.click();
  }

  
  async openApplyLeave() {
    await this.openLeavePage();
    await expect(this.applyMenuItem).toBeVisible();
    await this.applyMenuItem.click();
    await expect(this.page).toHaveURL(/applyLeave/);
  }

   
  async applyLeave(leaveType: string, fromDate: string, toDate: string, comment?: string) {
    await this.openApplyLeave();

    // Select Leave Type
    await expect(this.leaveTypeDropdown).toBeVisible();
    await this.leaveTypeDropdown.click();
    await this.page.locator(`div[role="option"]:has-text("${leaveType}")`).click();

    // Fill Dates
    await expect(this.fromDateInput).toBeVisible();
    await this.fromDateInput.fill(fromDate);

    await expect(this.toDateInput).toBeVisible();
    await this.toDateInput.fill(toDate);

    
    if (comment) {
      await this.commentBox.fill(comment);
    }

    // Apply leave
    await expect(this.applyButton).toBeEnabled();
    await this.applyButton.click();

    // Verify success toast
    await expect(this.successToast).toBeVisible();
  }

  
  async verifyLeaveInMyList(fromDate: string, toDate: string) {
    await this.openLeavePage();
    await expect(this.myLeaveMenuItem).toBeVisible();
    await this.myLeaveMenuItem.click();
    await expect(this.page).toHaveURL(/viewMyLeaveList/);

    // Check that the leave record is shown
    const leaveRow = this.page.locator(`div:has-text("${fromDate}") >> div:has-text("${toDate}")`);
    await expect(leaveRow.first()).toBeVisible();
  }
}
