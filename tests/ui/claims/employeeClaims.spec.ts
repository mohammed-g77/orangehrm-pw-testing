import { test, expect } from '@playwright/test';
import { LogIn } from '../../../pages/LoginPage';
import { AddEmployee } from '../../../pages/AddEmployee';
import { ClaimsPage } from '../../../pages/ClaimsPage';
import { ClaimsAdminPage } from '../../../pages/ClaimsAdminPage';
import { Claim, Employee } from '../../../helpers/apiHelpers';
import { saveClaimFixture, loadClaimFixtures } from '../../../fixtures/claimsFixture';
import { generateUniqueEmployeeIds } from '../../../helpers/generateRandoms';
const employeeData = require('../../../data/employee.json');
const claimsData = require('../../../data/claims.json');

test.describe('Employee Claims Test - Data Based Testing', () => {
  let createdEmployee: Employee;
  let createdClaims: Claim[] = [];

  test.beforeAll(async () => {
    // Load test data
    const baseEmployees: Employee[] = employeeData as Employee[];
    const employees = generateUniqueEmployeeIds(baseEmployees);
    createdEmployee = employees[0]; // Use first employee for this test
  });

  test('Add employee and submit 3 different claims with different currencies and expenses', async ({ page }) => {
    test.setTimeout(180000); 
    const login = new LogIn(page);
    const addEmployee = new AddEmployee(page);
    const claimsPage = new ClaimsPage(page);

    //Login as Admin and Add Employee
    await login.goto();
    await login.login('Admin', 'admin123');
    await expect(page).toHaveURL(/dashboard/);
    // Wait for dashboard to fully load
    await expect(page.locator('h6')).toContainText('Dashboard');

    await addEmployee.openPIM();
    // Get the actual username that was created (with random number)
    const actualUsername = await addEmployee.addEmployee(
      createdEmployee.firstName,
      createdEmployee.lastName,
      createdEmployee.username,
      createdEmployee.password,
      createdEmployee.password,
      createdEmployee.middleName
    );

    await expect(page.locator('h6:has-text("Personal Details")')).toBeVisible();

    createdEmployee.username = actualUsername;

    //Logout and Login as Employee
    await login.logout();

    await login.login(actualUsername, createdEmployee.password);
    await expect(page).toHaveURL(/dashboard|pim\/viewPersonalDetails/, { timeout: 10000 });
    
    //Employee submits 3 different claims
    const claims: Claim[] = claimsData as Claim[];
    
    // Create 3 claims and add expenses to each
    for (let i = 0; i < claims.length; i++) {
      const claimData = claims[i];
      
      if (i > 0) {
        // Wait for loaders to finish instead of networkidle
        await page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1000);
      }
      
      await claimsPage.gotoClaims();
      await claimsPage.gotoSubmitClaim();

      await claimsPage.selectEvent(claimData.event);
      // console.log(`Event field filled with: ${claimData.event}`);
      
      await claimsPage.selectCurrency(claimData.currency);
      await claimsPage.submitClaim();
      
      //add 3 expenses to this claim
      for (const expense of claimData.expenses) {
        // Wait a bit between expenses
        await page.waitForTimeout(500);
        
        await claimsPage.addExpenseToClaim(
          expense.type,
          expense.date,
          expense.amount,
          expense.notes
        );
        console.log(`Added expense: ${expense.type} - ${expense.amount}`);
      }
      
      // Wait after completing all expenses for this claim before moving to next
      await page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    };

    // Assertion - Employee perspective: Verify claims were submitted
    expect(createdClaims.length).toBe(3);
    expect(createdClaims[0].currency).toBe('Iraqi Dinar');
    expect(createdClaims[1].currency).toBe('Iraqi Dinar');
    expect(createdClaims[2].currency).toBe('Iraqi Dinar');
    expect(createdClaims[0].expenses.length).toBe(3);
    expect(createdClaims[1].expenses.length).toBe(3);
    expect(createdClaims[2].expenses.length).toBe(3);
  });

  // test('Admin processes claims - Approve, Reject, NoAction', async ({ page }) => {
  //   const login = new LogIn(page);
  //   const claimsAdminPage = new ClaimsAdminPage(page);

  //   // Load fixtures to get created claims
  //   const fixtures = loadClaimFixtures();
  //   expect(fixtures.length).toBeGreaterThan(0);
    
  //   const latestFixture = fixtures[fixtures.length - 1];
  //   const employeeName = `${latestFixture.employee.firstName} ${latestFixture.employee.lastName}`;

  //   // Step 1: Login as Admin
  //   await login.goto();
  //   await login.login('Admin', 'admin123');
  //   await expect(page).toHaveURL(/dashboard/);

  //   // Step 2: Navigate to Employee Claims
  //   await claimsAdminPage.gotoClaims();
  //   await claimsAdminPage.gotoEmployeeClaims();

  //   // Step 3: Process each claim according to adminAction
  //   for (let i = 0; i < latestFixture.claims.length; i++) {
  //     const claim = latestFixture.claims[i];
      
  //     // Navigate back to employee claims list if needed
  //     if (i > 0) {
  //       await claimsAdminPage.gotoClaims();
  //       await claimsAdminPage.gotoEmployeeClaims();
  //     }

  //     // View the claim
  //     await claimsAdminPage.viewClaim(employeeName);
      
  //     // Wait for claim details to load
  //     await page.waitForTimeout(1000);

  //     // Process claim based on adminAction
  //     switch (claim.adminAction) {
  //       case 'Approve':
  //         await claimsAdminPage.approveClaim(`Approved claim ${claim.id} - ${claim.claimType}`);
  //         await claimsAdminPage.verifySuccessMessage();
  //         break;
        
  //       case 'Reject':
  //         await claimsAdminPage.rejectClaim(`Rejected claim ${claim.id} - ${claim.claimType}`);
  //         await claimsAdminPage.verifySuccessMessage();
  //         break;
        
  //       case 'NoAction':
  //         // Do nothing, just view and go back
  //         await page.locator('button[type="button"]:has-text("Cancel")').click();
  //         break;
  //     }
  //   }

  //   // Step 4: Verify claims status from Admin perspective
  //   await claimsAdminPage.gotoClaims();
  //   await claimsAdminPage.gotoEmployeeClaims();

  //   // Assertions - Admin perspective
  //   for (let i = 0; i < latestFixture.claims.length; i++) {
  //     const claim = latestFixture.claims[i];
      
  //     if (claim.adminAction !== 'NoAction') {
  //       // Verify claim status in the list
  //       const status = await claimsAdminPage.getClaimStatus(employeeName);
  //       expect(status).toBeTruthy();
  //     }
  //   }

  //   // Update fixtures with final status
  //   const updatedClaims = latestFixture.claims.map(claim => ({
  //     ...claim,
  //     status: claim.adminAction === 'NoAction' ? 'Pending' : 
  //             claim.adminAction === 'Approve' ? 'Approved' : 'Rejected'
  //   }));

  //   const updatedFixture = {
  //     ...latestFixture,
  //     claims: updatedClaims
  //   };
  //   saveClaimFixture(updatedFixture);
  // });

  // test('Verify claims data from fixtures', async () => {
  //   const fixtures = loadClaimFixtures();
    
  //   expect(fixtures.length).toBeGreaterThan(0);
    
  //   const latestFixture = fixtures[fixtures.length - 1];
    
  //   // Assertions on saved fixtures
  //   expect(latestFixture.employee).toBeDefined();
  //   expect(latestFixture.employee.firstName).toBeTruthy();
  //   expect(latestFixture.employee.username).toBeTruthy();
    
  //   expect(latestFixture.claims.length).toBe(3);
    
  //   // Verify all 3 claims have different currencies
  //   const currencies = latestFixture.claims.map(c => c.currency);
  //   expect(new Set(currencies).size).toBe(3); // All different
    
  //   // Verify all claims have 3 expenses each
  //   latestFixture.claims.forEach(claim => {
  //     expect(claim.expenses.length).toBe(3);
  //   });
    
  //   // Verify admin actions are different
  //   const actions = latestFixture.claims.map(c => c.adminAction);
  //   expect(actions).toContain('Approve');
  //   expect(actions).toContain('Reject');
  //   expect(actions).toContain('NoAction');
  // });
});

