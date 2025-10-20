import { test, expect } from '@playwright/test';
import { Employee, LeaveType } from '../../helpers/apiHelpers';
import { generateUniqueEmployeeIds } from '../../helpers/generateRandoms';
const employeeTemplates = require('../../data/employee.json');

test.describe('Employee Leave Application and Admin Approval', () => {
    let adminCookies: any;
    let employeeCookies: any;
    let addedEmployee: any;
    let leaveRequestId: number;
    let empNumber: number;
    let assignedLeaveTypeId: number;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://opensource-demo.orangehrmlive.com');
        await page.locator('input[name="username"]').fill('Admin');
        await page.locator('input[name="password"]').fill('admin123');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/dashboard/);
        adminCookies = await context.cookies();
        await context.close();
    });

    test('Admin adds employee with login credentials and assigns 14 leave days', async ({ request }) => {
        const baseEmployees: Employee[] = employeeTemplates as Employee[];
        const employees = generateUniqueEmployeeIds(baseEmployees);
        const employee = employees[0]; 

        const addEmployeeResponse = await request.post(
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
                    'Cookie': adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; ')
                }
            }
        );

        expect(addEmployeeResponse.ok()).toBeTruthy();
        const employeeData = await addEmployeeResponse.json();
        empNumber = employeeData.data?.empNumber;
        addedEmployee = { employee, empNumber, success: true };

        expect(empNumber).toBeDefined();

        const createUserResponse = await request.post(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users',
            {
                data: {
                    username: employee.username,
                    password: employee.password,
                    status: true,
                    userRoleId: 2, 
                    empNumber: empNumber
                },
                headers: {
                    'Cookie': adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; '),
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!createUserResponse.ok()) {
            const errorText = await createUserResponse.text();
        }

        expect(createUserResponse.ok()).toBeTruthy();

        await new Promise(resolve => setTimeout(resolve, 5000));

        const leaveTypesResponse = await request.get(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-types',
            { headers: { 'Cookie': adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; ') } }
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

        assignedLeaveTypeId = leaveTypeId; 
        const currentYear = new Date().getFullYear();
        const entitlementResponse = await request.post(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements',
            {
                data: {
                    empNumber: empNumber,
                    leaveTypeId: assignedLeaveTypeId,
                    fromDate: `${currentYear}-01-01`,
                    toDate: `${currentYear}-12-31`,
                    entitlement: 14
                },
                headers: {
                    'Cookie': adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; '),
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!entitlementResponse.ok()) {
            const errorText = await entitlementResponse.text();
        } else {
            const entitlementData = await entitlementResponse.json();
        }

        expect(entitlementResponse.ok()).toBeTruthy();

        await new Promise(resolve => setTimeout(resolve, 8000));


        const entitlementsResponse = await request.get(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements',
            {
                headers: {
                    'Cookie': adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; ')
                }
            }
        );

        if (entitlementsResponse.ok()) {
            const entitlementsData = await entitlementsResponse.json();
        } else {
            console.log('Failed to fetch all entitlements:', entitlementsResponse.status());
        }

        const balanceResponse = await request.get(
            `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/employees/${empNumber}/leave-balance`,
            {
                headers: {
                    'Cookie': adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; ')
                }
            }
        );

        if (balanceResponse.ok()) {
            const balanceData = await balanceResponse.json();
        } else {
            console.log('Failed to fetch leave balance:', balanceResponse.status());
        }
    });

    test('Employee logs in and applies for 3-day leave', async ({ browser, request }) => {

        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://opensource-demo.orangehrmlive.com');
        await page.locator('input[name="username"]').fill(addedEmployee.employee.username);
        await page.locator('input[name="password"]').fill(addedEmployee.employee.password);
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/dashboard/);
        employeeCookies = await context.cookies();

        const today = new Date();
        const currentYear = today.getFullYear();

        const fromDate = new Date(currentYear, today.getMonth(), today.getDate() );
        const toDate = new Date(currentYear, today.getMonth(), today.getDate() + 3);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];


        const leaveApplicationResponse = await request.post(
            'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-requests',
            {
                data: {
                    leaveTypeId: assignedLeaveTypeId,
                    fromDate: formatDate(fromDate),
                    toDate: formatDate(toDate),
                    comment: "Personal leave request for 3 days"
                },
                headers: {
                    'Cookie': employeeCookies.map((c: any) => `${c.name}=${c.value}`).join('; '),
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!leaveApplicationResponse.ok()) {
            const errorText = await leaveApplicationResponse.text();
        }

        expect(leaveApplicationResponse.ok()).toBeTruthy();
        const leaveData = await leaveApplicationResponse.json();
        leaveRequestId = leaveData.data?.id;

        expect(leaveRequestId).toBeDefined();

        await context.close();
    });

    test('Admin logs in again and approves the leave request', async ({ request }) => {
        const approveResponse = await request.put(
            `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/employees/leave-requests/${leaveRequestId}`,
            {
                data: {
                    action: "APPROVE"
                },
                headers: {
                    'Cookie': adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; '),
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!approveResponse.ok()) {
            const errorText = await approveResponse.text();
        } else {
            const approveData = await approveResponse.json();
        }

        expect(approveResponse.ok()).toBeTruthy();
    });

    test.afterAll(async ({ request }) => {
        if (addedEmployee?.empNumber) {
            try {
                const deleteResponse = await request.delete(
                    'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees',
                    {
                        data: { ids: [addedEmployee.empNumber] },
                        headers: {
                            'Cookie': adminCookies.map((c: any) => `${c.name}=${c.value}`).join('; '),
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (deleteResponse.ok()) {
                    console.log(`Deleted employee: ${addedEmployee.employee.firstName} ${addedEmployee.employee.lastName}`);
                } else {
                    const errText = await deleteResponse.text();
                }
            } catch (error) {
                console.log(`Error deleting employee: ${addedEmployee.employee.firstName} ${addedEmployee.employee.lastName}`, error);
            }
        }
    });
});