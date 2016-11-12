import Employee from './Employee';
import Department from './Department';

export default function averageSalary(employees: Employee[], minSalary: number, department?: Department): number {
   let total = 0;
   let count = 0;

   employees.forEach((e) => {
     if(minSalary <= e.salary && (department === undefined || department.works(e))){
       total += e.salary;
       count += 1;
     }
   });

  return total === 0 ? 0 : total / count;
 }