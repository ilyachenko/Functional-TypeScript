import Employee from './Employee';

export default class Department {
  constructor(public employees: Employee[]) {}

  works(employee: Employee): boolean {
    return this.employees.indexOf(employee) > -1;
  }
}