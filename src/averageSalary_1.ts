import Employee from './Employee';

type Predicate = (e: Employee) => boolean;

export default function averageSalary(employees: Employee[], salaryCondition: Predicate,
                       departmentCondition?: Predicate): number {
    let total = 0;
    let count = 0;

    employees.forEach((e) => {
        if(salaryCondition(e) && (departmentCondition === undefined || departmentCondition(e))){
            total += e.salary;
            count += 1;
        }
    });

    return total === 0 ? 0 : total / count;
}
