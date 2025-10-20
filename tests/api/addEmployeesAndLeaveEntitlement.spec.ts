import { test, expect } from '@playwright/test';
import { Employee, LeaveType } from '../../helpers/apiHelpers';
import { generateUniqueEmployeeIds } from '../../helpers/generateRandoms';
const employeeData = require('../../data/employee.json');

test.describe('Add employees and assign leave entitlement days test', () => {
  let cookies: any;
  let addedEmployees: any[] = [];

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://opensource-demo.orangehrmlive.com');
    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/dashboard/);
    cookies = await context.cookies();
    await context.close();
  });

  test('Add 5 employees and assign 14 days leave entitlement', async ({ request }) => {
    const baseEmployees: Employee[] = employeeData as Employee[];
    const employees = generateUniqueEmployeeIds(baseEmployees);

    for (const employee of employees) {
      try {
        const response = await request.post(
          'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees',
          {
            data: {
              firstName: employee.firstName,
              middleName: employee.middleName || "",
              lastName: employee.lastName,
              empPicture: null,
              employeeId: employee.employeeId
            },
            headers: {
              'Cookie': cookies.map((c: any) => `${c.name}=${c.value}`).join('; ')
            }
          }
        );

        if (response.ok()) {
          const data = await response.json();
          addedEmployees.push({
            employee,
            empNumber: data.data?.empNumber,
            success: true
          });
        }
      } catch (error) {
        addedEmployees.push({
          employee,
          success: false,
          error
        });
      }
    }

    expect(addedEmployees.length).toBeGreaterThan(0);

    const leaveTypesResponse = await request.get(
      'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-types',
      { headers: { 'Cookie': cookies.map((c: any) => `${c.name}=${c.value}`).join('; ') } }
    );

    let leaveTypeId = 1;
    if (leaveTypesResponse.ok()) {
      const leaveTypesData = await leaveTypesResponse.json();
      const leaveTypes: LeaveType[] = leaveTypesData.data || [];
      const annualLeave = leaveTypes.find(
        lt => lt.name.toLowerCase().includes('US - Vacation')
      );
      leaveTypeId = annualLeave ? annualLeave.id : (leaveTypes[0]?.id || 1);
    }

    const currentYear = new Date().getFullYear();
    const entitlementResults = [];

    for (const emp of addedEmployees) {
      if (!emp.empNumber) continue;

      try {
        const entitlementResponse = await request.post(
          'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements',
          {
            data: {
              empNumber: emp.empNumber,
              leaveTypeId,
              fromDate: `${currentYear}-01-01`,
              toDate: `${currentYear}-12-31`,
              entitlement: 14
            },
            headers: {
              'Cookie': cookies.map((c: any) => `${c.name}=${c.value}`).join('; '),
              'Content-Type': 'application/json'
            }
          }
        );

        entitlementResults.push({
          employee: emp.employee,
          empNumber: emp.empNumber,
          success: entitlementResponse.ok(),
          entitlementData: entitlementResponse.ok() ? await entitlementResponse.json() : null
        });
      } catch (error) {
        entitlementResults.push({ employee: emp.employee, empNumber: emp.empNumber, success: false, error });
      }
    }

    expect(entitlementResults.filter(r => r.success).length).toBeGreaterThan(0);
  });

  test.afterAll(async ({ request }) => {
  for (const emp of addedEmployees) {
    if (!emp.empNumber) continue;

    try {
      const deleteResponse = await request.delete(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees',
        {
          data: { ids: [emp.empNumber] },
          headers: {
            'Cookie': cookies.map((c: any) => `${c.name}=${c.value}`).join('; '),
            'Content-Type': 'application/json'
          }
        }
      );

      if (deleteResponse.ok()) {
        console.log(`Deleted employee: ${emp.employee.firstName} ${emp.employee.lastName}`);
      } else {
        const errText = await deleteResponse.text();
        console.log(`Failed to delete employee: ${emp.employee.firstName} ${emp.employee.lastName} — ${errText}`);
      }
    } catch (error) {
      console.log(`Error deleting employee: ${emp.employee.firstName} ${emp.employee.lastName}`, error);
    }
  }
});

});
