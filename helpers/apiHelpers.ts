export interface Employee {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  password: string;
  employeeId: string;
  empNumber?: string;
}

export interface LeaveType {
  id: number;
  name: string;
  deleted: boolean;
}

export interface Expense {
  type: string;
  date: string;
  amount: string;
  notes: string;
}

export interface Claim {
  id: string;
  claimType: string;
  currency: string;
  event: string;
  remarks: string;
  expenses: Expense[];
  adminAction: "Approve" | "Reject" | "NoAction";
  status?: string;
  claimReference?: string;
}

export interface ClaimFixture {
  employee: Employee;
  claims: Claim[];
  createdDate: string;
}
