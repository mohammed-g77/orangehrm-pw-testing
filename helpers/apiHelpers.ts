// helpers/apiHelpers.ts
import { APIRequestContext } from "@playwright/test";

export async function addNewEmployeeViaAPI(apiContext: APIRequestContext, employee: { firstName: string, lastName: string, username: string, password: string }) {
  const response = await apiContext.post("/employee", {
    data: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      username: employee.username,
      password: employee.password
    }
  });
  return response;
}
