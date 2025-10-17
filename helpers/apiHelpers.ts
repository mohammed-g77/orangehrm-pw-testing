export interface Employee {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  password: string;
  employeeId: string;
}
export interface LeaveType {
  id: number;
  name: string;
  deleted: boolean;
}
