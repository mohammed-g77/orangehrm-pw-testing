import {Employee} from './apiHelpers';

export function generateRandomEmployeeId(baseId: string): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generates 4-digit number (1000-9999)
  return `${baseId}_${randomSuffix}`;
}

export function generateUniqueUsername(baseUsername: string): string {
  const randomSuffix = Math.floor(100 + Math.random() * 900); 
  return `${baseUsername}_${randomSuffix}`;
}

export function generateUniqueFirstName(baseFirstName: string): string {
  const randomSuffix = Math.floor(1 + Math.random() * 99); 
  return `${baseFirstName}${randomSuffix}`;
}

export function generateUniqueEmployeeIds(employees: Employee[]): Employee[] {
  return employees.map(employee => ({
    ...employee,
    empNumber: generateRandomEmployeeId(employee.employeeId),
    username: generateUniqueUsername(employee.username),
    firstName: generateUniqueFirstName(employee.firstName)
  }));
}